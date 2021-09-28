import React, { useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { useLocation } from 'react-router';

import '../others/SpeakerDetail.scss';
import './MapView.scss';

import { ActionSheetButton } from '@ionic/core';
import { IonActionSheet, IonChip, IonIcon, IonHeader, IonLabel, IonToolbar, IonButtons, IonContent, IonButton, IonBackButton, IonPage, IonMenuButton } from '@ionic/react'
import { callOutline, callSharp, logoTwitter, logoGithub, logoInstagram, shareOutline, shareSharp, arrowBackOutline, arrowBackSharp } from 'ionicons/icons';
import Map from '../../components/Map';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Wrapper } from "@googlemaps/react-wrapper";

interface OwnProps extends RouteComponentProps {
};

interface StateProps {};

interface DispatchProps {}; 

interface SpeakerDetailProps extends OwnProps, StateProps, DispatchProps {};

const MapView: React.FC = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionSheetButtons, setActionSheetButtons] = useState<ActionSheetButton[]>([]);
  const [actionSheetHeader, setActionSheetHeader] = useState('');

  function openSpeakerShare() {
    setActionSheetButtons([
      {
        text: 'Copy Link',
        handler: () => {
          console.log('Copy Link clicked');
        }
      },
      {
        text: 'Share via ...',
        handler: () => {
          console.log('Share via clicked');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]);
    setActionSheetHeader(`Share`);
    setShowActionSheet(true);
  }

  function openContact() {
    
  }

  function openExternalUrl(url: string) {
    window.open(url, '_blank');
  }

  return (
    <IonPage >
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons> 

            <IonButtons slot="end">
              <IonButton onClick={() => openContact()}>
                <IonIcon slot="icon-only" ios={callOutline} md={callSharp}></IonIcon>
              </IonButton>
              <IonButton onClick={() => openSpeakerShare()}>
                <IonIcon slot="icon-only" ios={shareOutline} md={shareSharp}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <div className="speaker-background">
          <Map /> 
          {/* <Wrapper apiKey={"AIzaSyAjPYLPZnfhQYszOkRp4BcHtEvJc3NJ7js"}>
            <Map /> 
          </Wrapper> */}
        </div>

        <div className="ion-padding speaker-detail">
          <p> Say hello on social media! (11:46)</p>

          <hr/>

          <IonChip color="twitter" onClick={() => openExternalUrl(`https://twitter.com/`)}>
            <IonIcon icon={logoTwitter}></IonIcon>
            <IonLabel>Twitter</IonLabel>
          </IonChip>

          <IonChip color="dark" onClick={() => openExternalUrl('https://github.com/ionic-team/ionic')}>
            <IonIcon icon={logoGithub}></IonIcon>
            <IonLabel>GitHub</IonLabel>
          </IonChip>

          <IonChip color="instagram" onClick={() => openExternalUrl('https://instagram.com/ionicframework')}>
            <IonIcon icon={logoInstagram}></IonIcon>
            <IonLabel>Instagram</IonLabel>
          </IonChip>
        </div>
      </IonContent>
      <IonActionSheet
        isOpen={showActionSheet}
        header={actionSheetHeader}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={actionSheetButtons}
      />
    </IonPage>
  );
};

export default MapView;
