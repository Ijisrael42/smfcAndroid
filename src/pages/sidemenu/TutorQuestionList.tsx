import { IonChip, IonLoading, IonBadge, IonList, IonLabel, IonSegment, IonSegmentButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonAvatar } from '@ionic/react';
import React, { useState, useEffect } from "react";
import { questionService } from '../../services/questionService';
import { accountService } from '../../services/accountService'; 
import { applicationService } from '../../services/applicationService';
import { bidService } from '../../services/bidService';
import SkeletonLoader from "../../components/SkeletonLoader";
import { config } from '../../helpers/config';
import Header from '../../components/Header';
import { useHistory } from 'react-router-dom';

const TutorQuestionList: React.FC = () => {
  
  const history = useHistory();
  const [questions, setQuestions] = useState<any>([]);
  const [posted, setPosted] = useState<any>([]);
  const [bids, setBids] = useState<any>([]);
  const [segment, setSegment] = useState('all');
  const [showLoading, setShowLoading] = useState<any>(false);
  const [showAllLoading, setShowAllLoading] = useState<any>(true);
  const [showPostedLoading, setShowPostedLoading] = useState<any>(true);
  const [showBidsLoading, setShowBidsLoading] = useState<any>(true);
  const [user, setUser] = useState();

  useEffect( () => {

    ( async () => {
      const user = await accountService.userValue;
      const tutor = await accountService.tutorValue;
      setUser(user);
      setShowLoading(true);   
  
      questionService.getByCategory({ category: tutor.category})
      .then( async (questionlist) => {
  
        const submitted = await questionService.getByVariable({ tutor_id: tutor.id, status: "Submitted"});
        const responded = await questionService.getByVariable({ tutor_id: tutor.id, status: "Responded"});
        questionlist = [ ...submitted, ...responded, ...questionlist ];

        bidService.getByTutorId(user.tutor_id)
        .then( bidlist => { 
          setShowBidsLoading(false);
          setShowAllLoading(false);

          let unbidded:any = [];
          let bidded:any = [];
          const bidQuestions = bidlist.map( (bid:any) => bid.question_id );
          questionlist.forEach( (question:any) => {
            if( bidQuestions.indexOf(question.id) === -1 ) unbidded.push(question);
            bidlist.forEach((bid:any) => {if(bid.question_id === question.id) bidded.push(bid);});
          });

          setBids(bidded);
          setPosted(unbidded);
          setShowPostedLoading(false);
        }); 

        setQuestions(questionlist); 
  
      }).catch(err => setShowAllLoading(false) );
  
    })();

  },[]); 

  return (
    <IonPage>

      <Header name="Questions" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Questions</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="">

          <IonToolbar color={config.themeColor}>
            <IonSegment scrollable value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
              {/* <IonBadge color="primary"></IonBadge> */}
              <IonSegmentButton value="all"> 
                { (segment === "all") ? 
                  (<IonChip><IonLabel><b>ACTIVE ({questions.length})</b> </IonLabel></IonChip>) : 
                  (<IonLabel  ><b>ACTIVE ({questions.length})</b> </IonLabel>) 
                }
              </IonSegmentButton>
              <IonSegmentButton value="posted">
                { (segment === "posted") ? 
                  (<IonChip> <IonLabel><b>UNBIDDED ({posted.length})</b></IonLabel></IonChip>)  : 
                  (<IonLabel  ><b>UNBIDDED ({posted.length})</b></IonLabel>) 
                }                
              </IonSegmentButton>
              <IonSegmentButton value="bid">
                { (segment === "bid") ? 
                  (<IonChip> <IonLabel><b>BIDS ({bids.length})</b></IonLabel> </IonChip>)  : 
                  (<IonLabel><b>BIDS ({bids.length})</b></IonLabel>) 
                }
              </IonSegmentButton> 
            </IonSegment>
          </IonToolbar>
          
          {/* All Questions */}
          <IonList style={ segment !== 'all' ? { display: 'none' } : {}}>
            {            
              questions.length > 0 && (
                questions && questions.map( (question: any) =>  (
                  <IonItem detail key={question.id} onClick={ (e) => { history.push(`/tutor/question/${question.id}`, question ) }} >
                    <IonAvatar slot="start">
                      <img src={`${config.userIcon}`}  alt="Speaker profile pic" />
                      {/* <img src={ user.profile_picture ? 
                      `${config.apiUrl}/files/image/${user.profile_picture}` : `${process.env.PUBLIC_URL}/img/avatar.png`
                      }  alt="Speaker profile pic" /> */}                
                    </IonAvatar>
                    <IonLabel>
                      <h2>{question.title}</h2>
                      <h6 style={{ opacity: ".5" }}>{question.date_time} ({question.no_of_hours} HRS)</h6>
                    </IonLabel> 
                    {question.status === "Paid" && ( <IonBadge color="danger" slot="end">{question.status}</IonBadge> )}
                    {question.status === "Submitted" && ( <IonBadge slot="end">{question.status}</IonBadge> )}
                    {question.status === "Responded" && ( <IonBadge slot="end">Bidded</IonBadge> )}

                  </IonItem>    
                ))
              )
            }
            { !showAllLoading && !questions.length && (<IonItem>No item Available</IonItem>)}
            {showAllLoading && (<SkeletonLoader />) }
          </IonList>

          {/* Submitted Questions */}
          <IonList style={ segment !== 'posted' ? { display: 'none' } : {}}>
            { 
              posted.length > 0 && ( 
                posted.map( (question: any) =>  (
                  <IonItem detail key={question.id} onClick={ (e) => { history.push(`/tutor/question/${question.id}`, question ) }} >
                    <IonAvatar slot="start">
                      <img src={`${config.userIcon}`}  alt="Speaker profile pic" />
                      {/* <img src={ user.profile_picture ? 
                      `${config.apiUrl}/files/image/${user.profile_picture}` : `${process.env.PUBLIC_URL}/img/avatar.png`
                      }  alt="Speaker profile pic" /> */}                
                    </IonAvatar>
                    <IonLabel>
                      <h2>{question.title}</h2>
                      <h6 style={{ opacity: ".5" }}>{question.date_time} ({question.no_of_hours} HRS)</h6>
                    </IonLabel>                  
                  </IonItem>    
                ))
              )
            }
            { !showPostedLoading && !posted.length && (<IonItem>No item Available</IonItem>)}
            {showPostedLoading && (<SkeletonLoader />) }
              
          </IonList>

          {/* Question Bids */}
          <IonList style={ segment !== 'bid' ? { display: 'none' } : {}}>
            { 
              bids.length > 0 && (
                bids.map( (bid: any) =>  (
                  <IonItem key={bid.id} >
                    <IonAvatar slot="start">
                      <img src={`${config.userIcon}`}  alt="Speaker profile pic" />
                      {/* <img src={ user.profile_picture ? 
                      `${config.apiUrl}/files/image/${user.profile_picture}` : `${process.env.PUBLIC_URL}/img/avatar.png`
                      }  alt="Speaker profile pic" /> */}                
                    </IonAvatar>
                    <IonLabel>
                      <h2>{bid.question_title} R{bid.price}</h2>
                      <h6 style={{ opacity: ".5" }}>{bid.created}</h6>
                    </IonLabel>
                    {bid.status === "Paid" && (<IonBadge color="danger" slot="end">{bid.status}</IonBadge>)}
                    {bid.status === "Submitted" && (<IonBadge slot="end">{bid.status}</IonBadge>)}
                  </IonItem>    
                ))
              )
            } 
            { !showBidsLoading && !bids.length && (<IonItem>No item Available</IonItem>)}
            {showBidsLoading && (<SkeletonLoader />) }
    
          </IonList>

          <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'}
              message={'Please wait...'}
              duration={5000}
          />

        </div>

      </IonContent>
    </IonPage>
  );
};

export default TutorQuestionList;
