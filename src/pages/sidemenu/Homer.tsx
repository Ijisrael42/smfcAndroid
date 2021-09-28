import { IonButtons, IonContent, IonChip, useIonPopover, IonText, IonItem, IonList, IonAvatar, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonLabel } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../../components/ExploreContainer';
import './Page.css';
import React, { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import PopoverList from "../../components/PopoverList";
import { config } from '../../helpers/config';
import Header from '../../components/Header';

const ContactUs: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  const [user, setUser] = useState<any>();

  useEffect(() => {
    setUser(accountService.userValue);
  },[]);

  return (
    <IonPage>

      <Header name="Contact Us" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Contact Us</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <IonItem color={config.buttonColor}> <IonLabel>Company Address :</IonLabel> </IonItem>
          <div style={{ marginTop: "20px", marginBottom: "20px" }} > 
          
            <IonItem lines="none">
              <IonText> 
                1162 Cowgill Street, <br/>
                Queenswood, <br/>
                Pretoria, <br/>
                Gauteng, <br/>
                South Africa. <br/>
              </IonText>
            </IonItem>
          </div>
          
          <IonItem color={config.buttonColor}> <IonLabel>Contact :</IonLabel> </IonItem>
          <div style={{ marginTop: "20px", marginBottom: "20px" }} >           

            <div style={{ marginLeft: "15px", marginTop: "10px" }} > 079 705 6905</div>
            <div style={{ marginLeft: "15px", marginTop: "10px" }} > 061 056 1249</div>
            <div style={{ marginLeft: "15px", marginTop: "10px" }} > 081 405 5679</div>
          </div>

          <IonItem color={config.buttonColor}> <IonLabel>Email Address :</IonLabel> </IonItem>
          <IonItem lines="none"><IonText> info@cliqclin.com </IonText></IonItem>
          
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ContactUs;
