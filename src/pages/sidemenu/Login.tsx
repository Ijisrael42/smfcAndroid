import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonButtons, IonBackButton, IonLoading, IonMenuButton, } from "@ionic/react";
import React, { useState } from "react";
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

const Login: React.FC = () => {

  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState<any>(false);
  const { logIn } = useAuth();
  
  const validationSchema = object().shape({
        email: string().required(),
        password: string().required(),
    });
    
    const { control, handleSubmit, errors }:any = useForm({
      resolver: useResolver(validationSchema),
    });
  
    const login = (data: any) => {
      setError("");
      console.log(data);
      setShowLoading(true);
      
      accountService.login(data.email, data.password)
      .then((user) => {
          // console.log(user);
        logIn(user);
        let strLocation = '';
  
        if( user && user.role === "User" ) history.push("/home");
        else if(user && user.role === "Tutor" ) history.push("/tutor");
  
      })
      .catch(error => {
        setError(error);
        setShowLoading(false);
      });
    };
  
  const handleFailure = async (response:any) => {
    console.log("Failed");
    console.log(response);
  };
  
  const handleSuccess = async (response:any) => {
  
    setShowLoading(true);
    accountService.googleLogin({ token: response.tokenId })
    .then((user) => {
        // console.log(user);
        logIn(user);
        let strLocation = '';
  
        if( user && user.role === "User" ) history.push("/home");
        else if(user && user.role === "Tutor" ) history.push("/tutor");
  
    })
    .catch(error => {
      // setError(error);
      setShowLoading(false);
    });
     
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

          <GoogleLogin
              clientId={config.google_client_Id}
              buttonText="Log In with Google"
              render={renderProps => (
                <GoogleButton                   
                  label="Log in with Google"
                  style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} 
                  onClick={renderProps.onClick}
                />
              )}
              onSuccess={handleSuccess}
              onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
              responseType="id_token"
              prompt='consent'
          />          

          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

          <form onSubmit={handleSubmit(login)}>           
            <Input name="email" label="Email" control={control} errors={errors} type="email" 
            placeholder="john@doe.com" />
            
            <Input name="password" label="Password" control={control} errors={errors} 
            type="password" />

            <IonButton color={config.themeColor} expand="block"  type="submit" className="ion-margin-top">
              Submit
            </IonButton>
          </form>

          <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'}
              message={'Please wait...'}
              duration={5000}
          />

          <IonButton routerLink="/register" color="secondary" expand="block" className="ion-margin-top">
            SIGN UP
          </IonButton>

          </div>
      </IonContent>

    </IonPage>
  );
};

export default Login;
