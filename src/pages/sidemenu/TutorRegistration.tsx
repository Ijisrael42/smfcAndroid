import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonText, IonButton, IonItem, IonCheckbox, IonLabel } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import { IonButtons, IonMenuButton } from '@ionic/react';
import { tutorService } from '../../services/tutorService'; 
import * as Yup from 'yup';
import '../others/Register.scss';

import { Plugins, Capacitor } from '@capacitor/core'
import { accountService } from '../../services/accountService'; 
import useResolver from "../../helpers/resolver";
import { config } from "../../helpers/config";
import Header from '../../components/Header';

const TutorRegistration: React.FC = () => {

  const { id } = useParams<any>();
  const history = useHistory();
  // const [error, setError] = useState("");
  const [ application, setApplication ] = useState<any>({});
  
  useEffect(() => {
  
    tutorService.getById(id) 
    .then( application => { 
        console.log(application);
        setApplication(application);
  
    }).catch( error => {
        console.log(error);
    });
    
  }, [id]);
  
  useEffect(() => {
      if (Capacitor.isNative) {
        Plugins.App.addListener('backButton', () => {
          if (history.location.pathname === '/') {
            Plugins.App.exitApp()
          } else if (history.location.pathname === '/detail') {
            history.push('/')
          } else {
            history.goBack()
          }
        })
      }
  }, []) // eslint-disable-line
  
  const validationSchema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
      acceptTerms: Yup.string().required('Accept Terms and Conditions')
  });
  
  const { control, handleSubmit, errors } = useForm({
    resolver: useResolver(validationSchema)
  });
  
  const registerTutor = (data: any) => {
      data = { tutor_id: application.id, email: application.email, role: 'Tutor', ...data };
      console.log("creating a new user account with: ", data);
      
      accountService.registerTutor(data)
      .then(response => {
        console.log(response);
        history.push('/profile/registration'); 
        
      }).catch( error => {
        console.log(error);
  
      });
      
  };
  
  return (
    <IonPage>

      <Header name="Create User Profile" />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Create User Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
      { application && (
        <>
          {/* <IonItem> <IonText>Name: {application.name}</IonText> </IonItem> */}
          <IonItem> <IonText>Email: {application.email}</IonText> </IonItem>

          <form onSubmit={handleSubmit(registerTutor)}>     
              <Input name="name" label="User Name" control={control} errors={errors}  placeholder="John Doe"  />
              <Input name="password" label="Password" control={control} errors={errors} 
              type="password" />
              <Input name="confirmPassword" label="Confirm Password" control={control} errors={errors} 
              type="password" />              
              <Input name="acceptTerms" label="I agree to the terms of service" control={control} errors={errors} 
              Component={IonCheckbox}
              />
              
              <IonButton color={config.themeColor} expand="block"  type="submit" className="ion-margin-top">
                Submit
              </IonButton>
          </form> 
        </>
      )}
      </div>

      </IonContent>
    </IonPage>
  );
};

export default TutorRegistration;
