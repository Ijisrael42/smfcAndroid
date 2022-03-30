import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonButtons, IonBackButton, IonLoading, IonMenuButton, IonIcon, IonLabel, } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import { object, string } from "yup";
import './Page.css';
import { accountService } from '../../services/accountService'; 
import { useHistory, useLocation, useParams } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import GoogleButton from 'react-google-button';
import { config } from "../../helpers/config";
import { useAuth } from '../../AuthContext'; 
import useResolver from "../../helpers/resolver";
import Header from '../../components/Header';
import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from '@capacitor/core';
import { usePlatform } from "@capacitor-community/react-hooks/platform/usePlatform";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { logoApple, logoGoogle } from "ionicons/icons";

const LoginCapacitor: React.FC = () => {

  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState<any>(false);
  const { logIn } = useAuth();
  const homeBtn = useRef<any>(null);
  const tutorBtn = useRef<any>(null);
  const settingsBtn = useRef<any>(null);
  const { platform } = usePlatform();
  const { token } = useParams<any>();

  const validationSchema = object().shape({
      email: string().required(),
      password: string().required(),
  });
  
  const { control, handleSubmit, errors } = useForm({
    resolver: useResolver(validationSchema),
  });

  const login = (data: any) => {

    console.log(data);
    setError("");
    setShowLoading(true);
    
    if( token ) {
      accountService.verifyEmail(token)
      .then((res) => {
        accountService.login(data.email, data.password)
        .then((user) => loginFn(user))
        .catch(error => { console.log(error); setShowLoading(false); });
      }).catch(error => {});  
    }
    else {
      accountService.login(data.email, data.password)
      .then((user) => loginFn(user))
      .catch(error => { console.log(error); setShowLoading(false); });
    }
  };

  const signIn = async () =>  {
    try{
      if( platform === 'web' ) GoogleAuth.init();
      const result = await GoogleAuth.signIn();
      if (result) {

        setShowLoading(true);
        accountService.googleLogin({ token: result.authentication.idToken })
        .then((user) => loginFn(user))
        .catch(error => { console.log(error); setShowLoading(false); });
      } 
    } catch(error) { }    
  };
  
  const signInApple = async () =>  {

      const { SignInWithApple } = Plugins;

      SignInWithApple.Authorize()
      .then(async (res:any) => {
        if (res.response && res.response.identityToken) {
          console.log("Response: ",res);
          setShowLoading(true);
           accountService.appleLogin({ token: res.response.identityToken, clientId: "com.cliqclin.app" })
           .then((user) => loginFn(user))
           .catch(error => { setError(error); setShowLoading(false); });
           //  .then((user) => console.log("User: ",user))
          setShowLoading(false);
        } else console.log("Error fetching response");

      }).catch( () => setShowLoading(false));
  };

  const loginFn = async (user:any) => { 
    accountService.update(user.id, { platform: platform});
    logIn(user); settingsBtn.current.click(); 
  }

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

          <IonButton color={config.buttonColor} onClick={signIn} shape="round" expand="block"  type="submit" className="ion-margin-bottom">
            <IonIcon slot="start" color="dark" ios={logoGoogle} /> <IonLabel>Sign In with Google </IonLabel>
          </IonButton>
          <IonButton color="light" onClick={signInApple} shape="round" expand="block"  type="submit" className="">
            <IonIcon slot="start" color="dark" ios={logoApple} /> <IonLabel>Sign In with Apple </IonLabel>
          </IonButton>

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

          <IonButton ref={settingsBtn} routerLink="/settings/login" className="ion-hide" />

          <IonLoading cssClass='my-custom-class' isOpen={showLoading} onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'} message={'Please wait...'} duration={5000} />

          </div>
      </IonContent>

    </IonPage>
  );
};

export default LoginCapacitor;
