import { IonButtons, IonBadge, IonLoading, IonText, IonBackButton, IonLabel, IonSegment, IonSegmentButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonChip, IonTextarea, IonList, IonCol, IonRow, IonGrid, IonFooter, useIonPopover } from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router';
// import './Intro.scss';
import React, { useState, useEffect } from "react";
import { bidService } from '../../services/bidService'; 
import { questionService } from '../../services/questionService'; 
// import { generateToken } from '../../helpers/firebase';
import { config } from "../../helpers/config";
import { accountService } from '../../services/accountService'; 
// import SkeletonLoader from "../../components/SkeletonLoader";
import { tutorService } from '../../services/tutorService';
import { fieldService } from '../../services/fieldService';
import { RatingView, Rating } from 'react-simple-star-rating'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';
import PopoverReport from '../../components/PopoverReport';

const Session: React.FC = () => {

  const [question, setQuestion] = useState<any>(null);
  const [segment, setSegment] = useState('favorites');
  const {state} = useLocation<any>();
  const { id, status } = useParams<any>();// {}//useParams();
  const { email } = accountService.userValue;
  const isOnline = navigator.onLine;
  const [present, dismiss] = useIonPopover(PopoverReport, { onHide: () => dismiss() });

  const [showLoading, setShowLoading] = useState(true);
  const [filetype, setFiletype] = useState("");
  const [tutor, setTutor] = useState<any>({});
  const [field, setField] = useState<any>(null);
  const [tutorRating, setTutorRating] = useState(0); // initial rating value
  const { control, handleSubmit, errors }:any = useForm();
  const handleRating = (rate:any) => { console.log(rate); setTutorRating(rate) };
  const rate = (data:any) => { data.tutor_rating_customer = tutorRating; update(data); };
  const { platform } = usePlatform();

  const setTutorDetails = (id:any) => {
    tutorService.getById(id)
    .then( tutor => {
      console.log(tutor);
      setTutor(tutor);
    }).catch( error =>  console.log(error));
  };

  const update = (data: any) => {
    setShowLoading(true);
    bidService.update(question.bid_id, data).then(bid => {
      questionService.update(question.id, data)
      .then( question => {
        updateQuestion(question);
        if( data.status === "Scheduled" ) window.location.href = `${config.zoomUrl}/zoom/${id}/${email}/1`;
      }).catch( error => console.log(error));
  
    }).catch( error => console.log(error) );   
  };

  const updateQuestion = (question: any) => {
    
    setTutorDetails(question.tutor_id);
    setCategory(question.category);
    setQuestion(question);
    if(question.image_name) setFiletype(question.image_name.split('.').pop());
    setShowLoading(false);
  };

  useEffect(() => {
    console.log(state)
    if(state) updateQuestion(state);    
    else {
      questionService.getById(id)
      .then( question => updateQuestion(question))
      .catch( error =>  { console.log(error); setShowLoading(false); });
    }

    // unsubscribe from state to avoid memory leak warning
    return () => setQuestion(null)
  }, []);

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
            <IonBackButton defaultHref="/tutor/sessions" />
          </IonButtons>
          <IonTitle>Tutor Session</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle size="large">Tutor Session</IonTitle>
          </IonToolbar>
        </IonHeader>

        { question && 
          (
            <div className="">
              { !isOnline && (<IonItem color="danger"><IonText>You are currently Offline</IonText></IonItem>) }
              <IonItem lines="full">
                <IonLabel>
                  <h2 style={{ fontSize: "18px" }}>{question.title}</h2>
                  <h6 style={{ opacity: ".5" }}>{question.date_time} ({question.no_of_hours}HRS)</h6>
                </IonLabel>
                <IonBadge slot="end">{question.status}</IonBadge>
              </IonItem>
                            
              <IonToolbar color={config.themeColor}>
                <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
                  <IonSegmentButton value="all">
                    { (segment === "all") ? 
                      (<IonChip><IonLabel><b>Details </b> </IonLabel></IonChip>) : 
                      (<IonLabel  ><b>Details </b> </IonLabel>) 
                    }
                  </IonSegmentButton>
                  <IonSegmentButton value="favorites">
                    { (segment === "favorites") ? 
                      (<IonChip><IonLabel><b>Session </b> </IonLabel></IonChip>) : 
                      (<IonLabel  ><b>Session </b> </IonLabel>) 
                    }
                  </IonSegmentButton>
                  
                  { question.status === "Complete" && ( 
                    <IonSegmentButton value="rating">
                      { (segment === "rating") ? 
                        (<IonChip><IonLabel><b>Rating </b> </IonLabel></IonChip>) : 
                        (<IonLabel  ><b>Rating </b> </IonLabel>) 
                      }
                    </IonSegmentButton>
                  )}

                </IonSegment>
              </IonToolbar>
              
              <div id="details" style={ segment === 'all' ? {} : { display: 'none' } } >
                { question && field && (
                  <IonList className="ion-padding">
                    <IonItem>Description :<br/>{question.description}</IonItem>                   
                    <IonItem>
                        <IonLabel>Category</IonLabel><IonText slot="end"><p>{field.name}</p></IonText>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Budget</IonLabel><IonText slot="end"><p>R {question.budget}</p></IonText>
                    </IonItem>
                    { question.image_name && (
                      <IonItem>
                        <IonText >{question.image_name}</IonText>
                        <IonButton slot="end" href={`${config.apiUrl}/files/image/${question.image_name}`} > VIEW DOC </IonButton> 
                      </IonItem>
                    )} 
                  </IonList>)}
              </div>

              <div style={ segment === 'favorites' ? {}: { display: 'none' } }>
                <IonList className="ion-padding">
                  
                  <div>
                      <IonGrid fixed>
                        <IonRow>
                          <IonCol size="7" >      
                            <IonButton disabled={ question.status === 'Complete' ? true : false } onClick={() => update({status: "Scheduled"})} color={config.buttonColor} expand="block" >
                            START NEW SESSION
                            </IonButton>
                          </IonCol> 
                          <IonCol size="5" >      
                            <IonButton disabled={ question.status === 'Complete' ? true : false } color="danger" onClick={() =>  update({status: "Complete"}) } expand="block" >
                            END SESSION
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonGrid> 

                    <IonList>
                      <IonItem>
                        <IonLabel>Tutor Name</IonLabel><IonText slot="end"><p>{tutor.name}</p></IonText>
                      </IonItem>
                      <IonItem>
                        {/* Description <br/> <br/>{tutor.description} */}
                        <IonLabel className="ion-text-wrap">
                          <IonText><h2>Description</h2></IonText>
                          <IonText ><p style={{ wordWrap: "break-word"}}>{tutor.description}</p></IonText>
                        </IonLabel>
                      </IonItem>
                      {/* <IonItem>
                        <IonLabel>Category</IonLabel><IonText slot="end"><p>{field.name}</p></IonText>
                      </IonItem> */}
                      <IonItem>
                        <IonLabel className="ion-text-wrap">
                          <IonText><h2>Experience</h2></IonText>
                          <IonText ><p style={{ wordWrap: "break-word"}}>{tutor.experience}</p></IonText>
                        </IonLabel>
                      </IonItem>

                    </IonList>
                  </div>
              </IonList>
             </div> 

             <div style={ segment === 'rating' ? {}: { display: 'none' } }>
              {/* { ( question.customer_comment || question.customer_rating_tutor ) && ( */}

                <div> 
                  <IonItem lines="full"> 
                    <IonLabel> <h2>Rating for Tutor</h2> </IonLabel> 
                    <RatingView ratingValue={ question.customer_rating_tutor ? question.customer_rating_tutor : 0 } /> 
                  </IonItem>
                  <IonItem lines="full"> <br/>Comments<br/><br/>{question.customer_comment} </IonItem>
                </div>
                
              {/* )} */}

              { ( question.tutor_comment || question.tutor_rating_customer) ?
                  ( <div style={{ marginTop: "20px"}} > 
                      <IonItem> 
                        <IonLabel> <h2>Rating for Customer</h2> </IonLabel> 
                        <RatingView ratingValue={ question.tutor_rating_customer ? question.tutor_rating_customer : 0 } /> 
                      </IonItem>
                      <IonItem><br/>Comments<br/><br/> {question.tutor_comment}</IonItem>
                    </div>
                  )
                : ( <form style={{ marginTop: "20px"}} onSubmit={handleSubmit(rate)}> 
                    <IonItem> 
                      <IonLabel> <h2>Rate Customer</h2> </IonLabel> 
                      <Rating onClick={handleRating} ratingValue={tutorRating} /> 
                    </IonItem>
                    <Input name="tutor_comment" label="Comments" control={control} errors={errors} placeholder="Comments" 
                    Component={IonTextarea}  />
                    <IonButton type="submit" color={config.themeColor} expand="block" className="ion-margin">SUBMIT</IonButton>
                  </form>
                )
              }    

              <IonFooter>
                <IonToolbar>
                  <IonButton color="danger" onClick={(e) => present({ event: e.nativeEvent,}) }
                   expand="block" className="ion-margin"> 
                  Report </IonButton>                
                </IonToolbar>
              </IonFooter>         
            </div>


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

export default Session;
