import { IonChip, IonButton, IonFooter, IonLoading, IonList, IonLabel, IonSegment, IonSegmentButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonFab, IonFabButton, IonIcon, IonAvatar } from '@ionic/react';
// import '../others/Page.css';
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { questionService } from '../../services/questionService';
import { accountService } from '../../services/accountService'; 
import SkeletonLoader from "../../components/SkeletonLoader";
import { addCircleOutline, addCircleSharp } from 'ionicons/icons';
import { config } from '../../helpers/config';
import Header from '../../components/Header';

const QuestionList: React.FC = () => {

  const history = useHistory();
  const [questions, setQuestions] = useState<any>([]);
  const [responded, setResponded] = useState<any>([]);
  const [pending, setPending] = useState<any>([]);
  const [segment, setSegment] = useState('all');
  const [showLoading, setShowLoading] = useState<any>(false);
  const [showAllLoading, setShowAllLoading] = useState<any>(true);
  const [showPendingLoading, setShowPendingLoading] = useState<any>(true);
  const [showRespondedLoading, setShowRespondedLoading] = useState<any>(true);
  const [user, setUser] = useState();

  const loaderOff = () => {
    setShowLoading(false);
    setShowAllLoading(false);
    setShowPendingLoading(false);
    setShowRespondedLoading(false);
  }

  useEffect( async () => { setUser( await accountService.userValue); }, []);
  useEffect(() => {
    setShowLoading(true);

    const user = accountService.userValue;
    console.log(user);
    questionService.getByUserId(user.id)
    .then( questions => {
        let respondedList:any = [];
        let pendingList:any = [];
        console.log(questions);

        questions.forEach( (question:any) => {
          if( question.status === "Responded" ) respondedList.push(question);
          else if( question.status === "Submitted" ) pendingList.push(question);
        })

        setQuestions(questions); 
        setResponded(respondedList);
        setPending(pendingList);
        loaderOff();
    }).catch( error => {
        console.log(error);
        loaderOff();
    });

  }, []);

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
            <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
              {/* <IonBadge color="primary"></IonBadge> */}
              <IonSegmentButton value="all"> 
                { (segment === "all") ? 
                  (<IonChip><IonLabel><b>ALL ({questions.length})</b></IonLabel></IonChip>) : 
                  (<IonLabel  ><b>ALL ({questions.length})</b></IonLabel>) 
                }
              </IonSegmentButton>
              <IonSegmentButton value="responded">
                { (segment === "responded") ? 
                  (<IonChip> <IonLabel><b>RESPONSES ({responded.length})</b></IonLabel></IonChip>)  : 
                  (<IonLabel  ><b>RESPONSES ({responded.length})</b></IonLabel>) 
                }                
              </IonSegmentButton>
              <IonSegmentButton value="pending">
                { (segment === "pending") ? 
                  (<IonChip> <IonLabel><b>PENDING ({pending.length})</b></IonLabel> </IonChip>)  : 
                  (<IonLabel><b>PENDING ({pending.length})</b></IonLabel>) 
                }
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
          
          <IonList style={ segment === 'all' ?  {} : { display: 'none' }}>
            { 
              questions.length > 0 && ( 
                questions.map( (question: any) =>  (                  
                  <IonItem key={question.id} detail onClick={ (e) => { history.push(`/question/${question.id}`, question ) }}  >
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
            { !showAllLoading && !questions.length && (<IonItem>No item Available</IonItem>)}
            {showAllLoading && (<SkeletonLoader />) }
          </IonList>

          <IonList style={ segment === 'responded' ?  {} : { display: 'none' }}>
            { 
              responded.length > 0 && ( 
                responded.map( (question: any) =>  (
                  <IonItem key={question.id} detail onClick={ (e) => { history.push(`/question/${question.id}`, question ) }}  >
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
            { !showRespondedLoading && !responded.length && (<IonItem>No item Available</IonItem>)}
            {showRespondedLoading && (<SkeletonLoader />) }
          </IonList>

          <IonList style={ segment === 'pending' ?  {} : { display: 'none' }}>
            { 
              pending.length > 0 && ( 
                pending.map( (question: any) =>  (
                  <IonItem key={question.id} detail onClick={ (e) => { history.push(`/question/${question.id}`, question ) }}  >
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
            { !showPendingLoading && !pending.length && (<IonItem>No item Available</IonItem>)}
            {showPendingLoading && (<SkeletonLoader />) }
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
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color={config.buttonColor} routerLink="/home">
            <IonIcon ios={addCircleOutline} md={addCircleSharp} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default QuestionList;
