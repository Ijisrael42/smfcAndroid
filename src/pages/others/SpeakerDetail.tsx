import React, { useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { useLocation } from 'react-router';

import './SpeakerDetail.scss';

import { ActionSheetButton } from '@ionic/core';
import { IonActionSheet, IonChip, IonIcon, IonHeader, IonLabel, IonToolbar, IonButtons, IonContent, IonButton, IonBackButton, IonPage } from '@ionic/react'
import { callOutline, callSharp, logoTwitter, logoGithub, logoInstagram, shareOutline, shareSharp, arrowBackOutline, arrowBackSharp } from 'ionicons/icons';
import { config } from '../../helpers/config';
import Img from 'react-cool-img';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

interface OwnProps extends RouteComponentProps {
};

interface StateProps {};

interface DispatchProps {}; 

interface SpeakerDetailProps extends OwnProps, StateProps, DispatchProps {};

const SpeakerDetail: React.FC = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionSheetButtons, setActionSheetButtons] = useState<ActionSheetButton[]>([]);
  const [actionSheetHeader, setActionSheetHeader] = useState('');
  const {state} = useLocation<any>();
  const img = state.img;
  const history = useHistory();
  const { platform } = usePlatform();

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
    <IonPage id="speaker-detail">
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonButtons slot="start">
              <IonButton onClick={ () => history.goBack() } >
                <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
              </IonButton>
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
          <Carousel showThumbs={false}>
            <div>
                <img src={`${config.apiUrl}/files/image/IMG_6533 (2).jpeg/400/300`} />
                {/* <p className="legend">Legend 1</p> */}
            </div>
            <div>
                <img src={`${config.apiUrl}/files/image/IMG_6605.jpeg/400/300`} />
                {/* <p className="legend">Legend 2</p> */}
            </div>
            <div>
                <img src={`${config.apiUrl}/files/image/IMG_5818.jpeg/400/300`} />
                {/* <p className="legend">Legend 3</p> */}
            </div>
          </Carousel> 
        </div>

        <div className="ion-padding speaker-detail">
          <p> Say hello on social media!</p>

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

export default SpeakerDetail;
