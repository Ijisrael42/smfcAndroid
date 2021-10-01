import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonText, IonButton, IonList, IonListHeader,
  IonItem, IonLabel, IonAvatar, useIonPopover,
} from "@ionic/react";

import { IonButtons, IonMenuButton } from '@ionic/react'; 
// import './Intro.scss';
import { accountService } from '../../services/accountService'; 
import { useState, useEffect } from "react";
import Header from '../../components/Header';

const Intro: React.FC = () => {

  const [user, setUser] = useState();
  useEffect( async () => { setUser(await accountService.userValue); }, []);

  return (
    <IonPage>

      <Header name="Intro" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Intro</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div className="ion-padding">

            <IonTitle color="medium" style={{fontSize: "50px"}} size="large">SMFC</IonTitle>
            <IonTitle color="medium" style={{fontSize: "20px"}} size="large">SaveMeFromCos</IonTitle>
            <IonList>
                <IonListHeader lines="inset">
                <IonText><h4>Steps</h4></IonText> 
                </IonListHeader>

                <IonItem><IonLabel><h3>1. Post your question with  a budget</h3></IonLabel></IonItem>
                <IonItem><IonLabel><h3>2. Tutor respond with their own prices.</h3></IonLabel></IonItem>
                <IonItem><IonLabel><h3>3. Select your prefered tutor</h3></IonLabel></IonItem>
                <IonItem><IonLabel><h3>4. Pay tutor and get your answers to your questions.</h3></IonLabel></IonItem>
                
            </IonList>
            { user ? (
                <IonButton routerLink="/home" color="primary" expand="block" className="ion-margin-top">
                  GET STARTED
                </IonButton>          
              )
              :
              (
                <IonButton routerLink="/register" color="primary" expand="block" className="ion-margin-top">
                  GET STARTED
                </IonButton>          
              )
            }           
            <IonList>
                <IonListHeader lines="inset">
                <IonText><h4>Benefits</h4></IonText>
                </IonListHeader>
                <IonItem>
                <IonLabel>
                    <h3>Quality process to get the best Tutors for you</h3>
                </IonLabel>
                </IonItem>
                <IonItem>
                <IonLabel>
                    <h3>Get quickest answers to your questions</h3>
                </IonLabel>
                </IonItem>
                <IonItem>
                <IonLabel>
                    <h3>Earn as a Tutor</h3>
                </IonLabel>
                </IonItem>
            </IonList>

            <IonButton routerLink="/tutor-application" color="secondary" expand="block" className="ion-margin-top">
                Be A Tutor
            </IonButton>

        </div>
      </IonContent>

    </IonPage>
  );
};

export default Intro;
