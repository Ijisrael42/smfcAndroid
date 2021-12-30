import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonButtons, IonBackButton, IonLoading, IonMenuButton, } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import { object, string } from "yup";
import './Page.css';
import { accountService } from '../../services/accountService'; 
import { useHistory, useLocation } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import GoogleButton from 'react-google-button';
import { config } from "../../helpers/config";
import { useAuth } from '../../AuthContext'; 
import useResolver from "../../helpers/resolver";
import Header from '../../components/Header';
import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from '@capacitor/core';

const LoginCapacitor: React.FC = () => {

  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState<any>(false);
  const { logIn } = useAuth();
  const homeBtn = useRef<any>(null);
  const tutorBtn = useRef<any>(null);
  
  const validationSchema = object().shape({
      email: string().required(),
      password: string().required(),
  });
  
  const { control, handleSubmit, errors } = useForm({
    resolver: useResolver(validationSchema),
  });

  useEffect(() => { Plugins.GoogleAuth.init();},[])

  const login = (data: any) => {
    setError("");
    console.log(data);
    setShowLoading(true);
    
    accountService.login(data.email, data.password)
    .then((user) => {
        // console.log(user);
      logIn(user);

      if( user && user.role === "User" ) homeBtn.current.click();
      else if(user && user.role === "Tutor" ) tutorBtn.current.click();

    })
    .catch(error => {
      setError(error);
      setShowLoading(false);
    });
  };

  const signIn = async () =>  {

    const result = await Plugins.GoogleAuth.signIn();
    if (result) {

      setShowLoading(true);
      accountService.googleLogin({ token: result.authentication.idToken })
      .then((user) => {
          logIn(user);
    
          if( user && user.role === "User" ) homeBtn.current.click();
          else if(user && user.role === "Tutor" ) tutorBtn.current.click();
        
      }).catch(error => {  setShowLoading(false); });
    } 
  };
  
  return (
    <IonPage>

      <Header name="Sign In" />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Sign In</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div className="ion-padding">

          <GoogleButton                   
            label="Log in with Google"
            style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} 
            onClick={signIn}
          />

          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

          <form onSubmit={handleSubmit(login)}>           
            <Input name="email" label="Email" control={control} errors={errors} type="email" 
            placeholder="john@doe.com" />
            
            <Input name="password" label="Password" control={control} errors={errors} 
            type="password" />

            <IonButton color={config.buttonColor} expand="block"  type="submit" className="ion-margin-top">
              Submit
            </IonButton>
          </form>

          <IonButton routerLink="/register" color="secondary" expand="block" className="ion-margin-top">
            SIGN UP
          </IonButton>

          <IonButton ref={homeBtn} routerLink="/home" className="ion-hide" />
          <IonButton ref={tutorBtn} routerLink="/tutor" className="ion-hide" />

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

export default LoginCapacitor;
