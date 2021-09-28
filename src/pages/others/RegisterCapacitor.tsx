import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButton,
  IonInput,
  IonLoading,
  IonLabel,
  IonCheckbox,
  IonButtons,
  IonIcon,
  IonFooter,
  IonItem,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import * as Yup from 'yup';
import useResolver from "../../helpers/resolver";
import './Register.scss';
import { useHistory } from "react-router-dom";
import { Plugins, Capacitor } from '@capacitor/core'
import { accountService } from '../../services/accountService'; 
import { GoogleLogin } from "react-google-login";
import GoogleButton from 'react-google-button'
import { config } from "../../helpers/config";
import { arrowBackOutline, arrowBackSharp, checkmarkDoneOutline, checkmarkDoneSharp } from "ionicons/icons";
import "@codetrix-studio/capacitor-google-auth";
import { usePlatform } from "@capacitor-community/react-hooks/platform/usePlatform";

const RegisterCapacitor: React.FC = () => {

  const history = useHistory();
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState<any>(false);
  const [submit, setSubmit] = useState<any>(false);
  const { platform } = usePlatform();

  useEffect(() => { Plugins.GoogleAuth.init();},[])

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
      name: Yup.string().required('Name is required'),
      email: Yup.string().email().required('Email is required'),
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
      acceptTerms: Yup.boolean().required('Accept Terms and Conditions')
  });
  
  const { control, handleSubmit, errors } = useForm({
    resolver: useResolver(validationSchema),
  });

  const registerUser = (data: any) => {
      console.log("creating a new user account with: ", data);
      setShowLoading(true);

      accountService.register(data)
      .then(response => {
        setSubmit(true);
        setShowLoading(false);
        setShowSuccess(true);
        console.log(response);
      }).catch(error => { setError(error) });         
  };
  
  const signUp = async () =>  {

    const result = await Plugins.GoogleAuth.signIn();
    if (result) {

      setShowLoading(true);
      accountService.googleSignUp({ token: result.authentication.idToken })
      .then((user) => {
          console.log(user);
          history.push('/profile/user');   
      })
      .catch(error => { setError(error) });   
    } 
  };

  const submitForm = () => {
    var submitButton = window.document.getElementById("submitForm") as HTMLIonButtonElement;
    submitButton.click();
  };

return (
  <IonPage id="register-page">
    <IonHeader>
      <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
        <IonButtons slot="start">
          <IonButton onClick={ () => history.goBack() } >
            <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
          </IonButton>
        </IonButtons> 
        <IonTitle>SIGN UP</IonTitle>          
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
          <IonTitle size="large">Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className={ submit ? "ion-hide" : "ion-padding" } >

        <h6 style={{ textAlign: "center" }}>
          <b>Sign up to get access to the pool of verified tutors to cater to your questions. Or </b>
          <a style={{ textDecoration: "none"}} href="/login">Sign In</a>
        </h6>

        <GoogleButton                   
          label="Sign Up with Google"
          style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} 
          onClick={signUp}
        />

        <p style={{ textAlign: "center", fontSize: "10px" }}><b>Sign up with Google and automatically agree to T&Cs.</b></p>
        
        { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

        <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            spinner={'bubbles'}
            message={'Please wait...'}
            duration={5000}
        />

        <form onSubmit={handleSubmit(registerUser)}>    
          <Input name="name" label="Name Surname" control={control} errors={errors} placeholder="John Doe" />    
          <Input name="email" label="Email" control={control} errors={errors} type="email" placeholder="john@doe.com" />
          <Input name="password" type="password" label="Password" control={control} errors={errors}  />
          <Input name="confirmPassword" label="Confirm Password" control={control} errors={errors} type="password" />
          <Input name="acceptTerms" label="I agree to the terms of service" control={control} errors={errors} 
          Component={IonCheckbox} />
          <IonButton id="submitForm" color={config.buttonColor} expand="block"  type="submit" className="ion-hide"></IonButton>
        </form>        
        
      </div>

      <div className={ !showSuccess ? "ion-hide container" : "container" } >   
        <div>
          <IonButton color={config.buttonColor} size="large" >
            <IonIcon slot="icon-only" ios={checkmarkDoneOutline} md={checkmarkDoneSharp} />
          </IonButton>
        </div><br/>
        <IonLabel>Thank you for your Registration!! We will be in contact you for account verification.</IonLabel>
      </div>

    </IonContent>

    <IonFooter className={ submit ? "ion-hide" : "" }>
      <IonToolbar>
        <IonButton className="ion-margin-horizontal" color={config.buttonColor} expand="full" onClick={submitForm}>SUBMIT
        </IonButton>
      </IonToolbar>
    </IonFooter>

  </IonPage>
);
};

export default RegisterCapacitor;
