import { IonButtons, IonText, IonBadge, IonGrid, IonLoading, IonRow, IonCol, IonButton, IonFooter, IonBackButton, IonList, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import { useLocation, useParams } from 'react-router';
// import './Intro.scss';
import React, { useState, useEffect } from "react";
import { questionService } from '../../services/questionService';
import { bidService } from '../../services/bidService';
import { accountService } from '../../services/accountService'; 
import Input from "../../components/Input";
import { object, number } from "yup";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import useResolver from "../../helpers/resolver";
import { config } from "../../helpers/config";
import { fieldService } from '../../services/fieldService';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const Question: React.FC = () => {

  const [question, setQuestion] = useState<any>(null);
  const { id } = useParams<{ id: string; }>();
  const [error, setError] = useState("");
  const history = useHistory();
  const [user, setUser] = useState<any>();
  const [showLoading, setShowLoading] = useState<any>(false);
  const [field, setField] = useState<any>({});
  const {state} = useLocation<any>();
  const [filetype, setFiletype] = useState("");
  const validationSchema = object().shape({ price: number().required().min(200), }); 
  const { control, handleSubmit, errors } = useForm({ resolver: useResolver(validationSchema), });
  const { platform } = usePlatform();

  useEffect(() => {
    console.log(accountService.userValue);
    setUser(accountService.userValue);

  }, [id]);

  useEffect(() => {

    if(state) {
      setCategory(state.category);
      setQuestion(state);
      if(state.image_name) setFiletype(state.image_name.split('.').pop());
      setShowLoading(false);
    }
    else {
      questionService.getById(id)
      .then( question => {
        setCategory(question.category);
        setQuestion(question);
        if(question.image_name) setFiletype(question.image_name.split('.').pop());
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


  const createBid = (data: any) => {
    setError(""); 
    setShowLoading(true);

    data = { ...data, question_id: question.id, question_title: question.title,
    tutor_id: user.tutor_id, tutor_name: user.name, status: "Submitted" };

    console.log("creating a new user account with: ", data);
    bidService.create(data)
    .then( response => {

      console.log(response);
      if( question.status === "Submitted" )
      {
        questionService.update(question.id,{ status: "Responded"})
        .then( question => { setQuestion(question); history.push("/tutor/questions");  })
        .catch( error => { console.log(error); });
      }
    })
    .catch( error => { 
      console.log(error);
      setError(error);
      setShowLoading(true);

    });
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
            <IonBackButton defaultHref="/tutor/questions" />
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

        <div className="">
          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

          { question && field && (
            <div>
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
              
              <IonList className="" lines="full">
                <IonItem>
                  Description :<br/>
                  {question.description}
                </IonItem>                   
                
                <IonItem>
                    <IonLabel>Category</IonLabel><IonText slot="end"><p>{field.name}</p></IonText>
                </IonItem>
                { question.image_name && (
                  <IonItem>
                    <IonText >{question.image_name}</IonText>
                      <IonButton slot="end" href={`${config.apiUrl}/files/image/${question.image_name}`} > VIEW DOC </IonButton> 
                  </IonItem>
                )} 
              </IonList>
            </div>
          )}
        </div>

        <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'}
              message={'Please wait...'}
              duration={5000}
          />
      </IonContent>

      { question && question.status === "Submitted" && (
        <IonFooter>
          <IonToolbar>
            <form onSubmit={handleSubmit(createBid)}>       
              <IonGrid fixed>
                <IonRow>
                  <IonCol size="7" >      
                    <Input name="price" label="Bid Price" type="number" control={control} errors={errors}  placeholder="Minimum Price of R200" />
                  </IonCol> 
                  <IonCol size="4" >      
                    <IonButton expand="block"  type="submit" className="ion-margin-top"> BID </IonButton> 
                  </IonCol>
                </IonRow>
              </IonGrid>                    
            </form>
          </IonToolbar>
        </IonFooter>
      )}

    </IonPage>
  );
};

export default Question;
