import { IonButtons, useIonToast, IonFooter, IonToggle, IonLoading, IonIcon, IonButton, IonBackButton, IonList, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import { useParams } from 'react-router';
// import './Intro.scss';
import React, { useState, useEffect, useRef } from "react";
import { accountService } from '../../services/accountService'; 
// import { generateToken } from '../../helpers/firebase';
import { useHistory } from "react-router-dom";
// import { config } from "../../helpers/config";
import { arrowBackOutline, arrowBackSharp} from 'ionicons/icons'; 
import { config } from '../../helpers/config';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';
// import { messaging } from '../../helpers/firebase';

const Settings: React.FC = () => {

  const { mode } = useParams<any>();
  const history = useHistory();
  const [showLoading, setShowLoading] = useState<any>(false);
  const [checked, setChecked] = useState(false);
  const user:any = accountService.userValue;
  const [error, setError] = useState("");
  const [present, dismiss] = useIonToast();
  const { platform } = usePlatform();
  const homeBtn = useRef<any>(null);

  useEffect(() => {
    const isToken = ( user && user.device_token !== "" ) ? true : false;
    setChecked(isToken);

  }, []);

  const enableDisable = async (isEnabled: any) => {

    if( isEnabled === checked ) return;
    setChecked(isEnabled); setShowLoading(true);

    if( isEnabled === true ) enable();
    else if( isEnabled === false ) update("");
  };

  const enable = async () => {

    try {
      /* const currentToken = await messaging.getToken({ vapidKey: config.vapidKey });
      console.log(currentToken);
      if (currentToken) update(currentToken);
      else { present("Notification was NOT Successful! ", 2000); setShowLoading(false); } */
    } 
    catch (err) { present("Notification was NOT Successful! ", 2000); setShowLoading(false); }
  }

  const update = ( token: string ) => {

    accountService.update(user.id, { device_token: token })
    .then(response => {
        setShowLoading(false); 
        if( token === "" ) present("Notification disabled Successfully! ", 2000);
        else present("Notification enabled Successfully! ", 2000);
    })
    .catch(error => { setShowLoading(false); present("Notification event was NOT Successful! ", 2000);  });
  };

  const logout = () => {
    const response:any = accountService.logout();
    if ( response === 'success' ) homeBtn.current.click();
    else response.then(() =>  homeBtn.current.click());
  }

  const next = () => {
    if( mode === "registration") history.push('/tutor');
    else if( mode === "user") history.push("/home");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
          <IonButtons slot="start">
            <IonButton onClick={ () => history.goBack() } >
              <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

          <IonItem lines="full">
            <IonLabel>Enable Notifications</IonLabel>
            <IonToggle slot="end" checked={checked} onIonChange={e => enableDisable(e.detail.checked)} />
          </IonItem>
          <IonItem lines="full" detail routerLink="/wallet">
            <IonLabel>Wallet</IonLabel>
          </IonItem>
        </div>

        <IonButton ref={homeBtn} routerLink="/home" className="ion-hide" />

        <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'}
              message={'Please wait...'}
              duration={5000}
          />

      </IonContent>

      <IonFooter>
        <IonToolbar>  
        { ( mode && mode === "registration" || mode === "user" ) ? (
          <IonButton onClick={next} disabled={ checked ? false : true } className="ion-margin-horizontal" color={config.buttonColor} expand="full" > NEXT </IonButton>
        ) : (
          <IonButton className="ion-margin-horizontal" color={config.buttonColor} expand="full" onClick={logout}> 
          LOGOUT </IonButton>
        )}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Settings;
