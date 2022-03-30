import { IonButtons, IonNote, IonLoading, IonText, IonBackButton, IonList, IonLabel, IonSegment, IonSegmentButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonBadge, IonChip, IonAvatar } from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router';
// import './Intro.scss';
import React, { useState, useEffect } from "react";
import { bidService } from '../../services/bidService'; 
import { questionService } from '../../services/questionService'; 
// import { generateToken } from '../../helpers/firebase';
import { config } from "../../helpers/config";
import { accountService } from '../../services/accountService'; 
import SkeletonLoader from "../../components/SkeletonLoader";
import { fieldService } from '../../services/fieldService'; 
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const Question: React.FC = () => {

  const [question, setQuestion] = useState<any>(null);
  const [bids, setBids] = useState([]);
  const { id } = useParams<{ id: string; }>();
  const [segment, setSegment] = useState<'all' | 'favorites'>('all');
  const {state} = useLocation<any>();
  const history = useHistory();
  const [showLoading, setShowLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [field, setField] = useState<any>({});
  // const [enableNotifications, setEnableNotifications] = useState(false);
  const [showTutorLoading, setShowTutorLoading] = useState<any>(true);
  const { platform } = usePlatform();

  useEffect(() => {

    if(state) {
      if(state.category) setCategory(state.category);
      if(state.image_name) setFiles(state.image_name.split(','));

      setQuestion(state);
      
      setShowLoading(false);
    }
    else {
      questionService.getById(id)
      .then( question => {
        if(question.category) setCategory(question.category);
        if(question.image_name) setFiles(question.image_name.split(','));

        setQuestion(question);
        setShowLoading(false);
      })
      .catch( error =>  {
        console.log(error);
        setShowLoading(false);
      });
    }

    // unsubscribe from state to avoid memory leak warning
    return () => setQuestion(null)
  }, [id]);

  useEffect(() => {
        bidService.getByQuestionId(id)
        .then(bids => {
          setBids(bids) 
          setShowTutorLoading(false);
        }).catch( error => console.log(error) );
  }, []);

  const allowNotification = async () => {
    // generateToken(setShowLoading)
  };

  const setCategory = (id: any) => {
    
    fieldService.getById(id)
    .then( field => {
      console.log( field );
      setField(field);
    })
    .catch( error => console.log(error) );
  }
  
  return (
    <IonPage>
      <IonHeader>
      <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/questions" />
          </IonButtons>
          <IonTitle>Question</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle size="large">Question</IonTitle>
          </IonToolbar>
        </IonHeader>

        { question && 
          (
            <div className="">
              
              <IonItem lines="full">
                <IonLabel>
                  <h2 style={{ fontSize: "18px" }}>{question.title}</h2>
                  <h6 style={{ opacity: ".5" }}>{question.date_time} ({question.no_of_hours}HRS)</h6>
                </IonLabel>
                <IonLabel slot="end">
                  <h2 style={{ fontSize: "18px" }}><b>R {question.budget}</b></h2>
                  <IonBadge slot="end">{question.status}</IonBadge>
                </IonLabel>
              </IonItem>

              <IonToolbar>
                <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
                  <IonSegmentButton value="all">
                    { (segment === "all") ? 
                      (<IonChip><IonLabel><b>Details </b> </IonLabel></IonChip>) : 
                      (<IonLabel  ><b>Details </b> </IonLabel>) 
                    }
                  </IonSegmentButton>
                  <IonSegmentButton value="favorites">
                    { (segment === "favorites") ? 
                      (<IonChip><IonLabel><b>Tutors </b> </IonLabel></IonChip>) : 
                      (<IonLabel  ><b>Tutors </b> </IonLabel>) 
                    }
                  </IonSegmentButton>
                </IonSegment>
              </IonToolbar>
              
              <div style={ segment === 'favorites' ? { display: 'none' } : {}} >
              <IonList className="ion-padding" lines="full">
                  {/* <IonItem lines="none"><IonLabel> Description </IonLabel></IonItem>
                  <IonItem><IonText><p>{question.description}</p></IonText></IonItem> */}

                  <IonItem>Description : <br/>{question.description}</IonItem>                   
                  { question.category && (<IonItem>
                    <IonLabel>Category</IonLabel><IonText slot="end"><p>{field.name}</p></IonText>
                  </IonItem>) }                  
                  { files && files.map( (file: any, key:any) =>  (
                    <IonItem key={key}>
                      <IonText >{file}</IonText>
                      <IonButton slot="end" href={`${config.apiUrl}/files/image/${file}`} > VIEW DOC </IonButton> 
                    </IonItem>
                  ))}                  
                </IonList>
              </div>

              <IonList className="ion-padding-horizontal" lines="full" style={ segment === 'all' ? { display: 'none' } : {}}>

                { bids.length > 0 && (
                    bids.map( (bid: any) =>  (
                      <IonItem detail key={bid.id} onClick={ (e) => { history.push(`/question/tutor/${bid.tutor_id}/${bid.status}/${bid.id}/${bid.question_id}`, bid ) }} >
                        <IonAvatar slot="start">
                          <img src={`${config.userIcon}`}  alt="Speaker profile pic" />
                          {/* <img src={ user.profile_picture ? 
                          `${config.apiUrl}/files/image/${user.profile_picture}` : `${process.env.PUBLIC_URL}/img/avatar.png`
                          }  alt="Speaker profile pic" /> */}                
                        </IonAvatar>
                        <IonLabel>
                          <h2>{bid.tutor_name} R{bid.price}</h2>
                          <h6 style={{ opacity: ".5" }}>{bid.created}</h6>
                        </IonLabel>
                      </IonItem>    
                    ))
                  ) 

                }
                { !showTutorLoading && !bids.length && (<IonItem>No item Available</IonItem>)}
                {showTutorLoading && (<SkeletonLoader />) }

              </IonList>

          </div>
        )
          
      }
    
      <IonLoading
        cssClass='my-custom-class'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)} 
        spinner={'bubbles'}
        message={'Please wait...'}
        // duration={5000}
      />
      </IonContent>
    </IonPage>
  );
};

export default Question;
