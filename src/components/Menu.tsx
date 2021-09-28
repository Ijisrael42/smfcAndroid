import {
  IonContent,
  IonFooter,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonThumbnail,
  IonToolbar,
  useIonToast,
} from '@ionic/react';

import { useHistory, useLocation } from 'react-router-dom';
import { walletOutline, walletSharp, helpCircleOutline, carOutline, carSharp, helpCircleSharp, clipboardOutline, clipboardSharp, peopleOutline, peopleSharp, personOutline, personSharp, gitPullRequestOutline, gitPullRequestSharp, createSharp, createOutline, informationCircleOutline, logInOutline, logInSharp, callOutline, callSharp, informationCircleSharp, homeOutline, homeSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, listOutline, listSharp, openOutline, openSharp, videocamOutline, videocamSharp, bulbSharp, bulbOutline } from 'ionicons/icons';
import './Menu.css';
import { supplierService } from '../services/supplierService';
import { accountService } from '../services/accountService';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import { config } from '../helpers/config';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const standardPages: AppPage[] = [
  { title: 'About Us', url: '/page/About Us', iosIcon: informationCircleOutline, mdIcon: informationCircleSharp },
  { title: 'Contact Us', url: '/contactus', iosIcon: callOutline, mdIcon: callSharp },
  { title: 'SIGN IN', url: '/login', iosIcon: logInOutline, mdIcon: logInSharp },
  { title: 'Introduction', url: '/intro', iosIcon: bulbOutline, mdIcon: bulbSharp }
];

const tutorPages: AppPage[] = [
  { title: 'Dashboard', url: '/tutor', iosIcon: clipboardOutline, mdIcon: clipboardSharp },
  { title: 'Questions', url: '/tutor/questions', iosIcon: helpCircleOutline, mdIcon: helpCircleSharp },
  { title: 'Sessions', url: '/tutor/sessions', iosIcon: videocamOutline, mdIcon: videocamSharp },
  { title: 'Account', url: '/tutor/account', iosIcon: walletOutline, mdIcon: walletSharp },
];

const appPages: AppPage[] = [
  { title: 'My Questions', url: '/questions', iosIcon: helpCircleOutline, mdIcon: helpCircleSharp },
  { title: 'Sessions', url: '/sessions', iosIcon: videocamOutline, mdIcon: videocamSharp },
];

const Menu: React.FC = () => {
  const location = useLocation();
  let { user, authUser } = useAuth();  
  const history = useHistory();
  let userType = "";

  if(!user) user = authUser();
  if( user && user.role === "Tutor" ) userType = "Tutor";
  else if( user && user.role === "User" ) userType = "User";

  const switctToUser = () => {
    accountService.switctToUser();
    history.push("/home");
  };

  const switctToTutor = () => {
    accountService.switctToTutor();
    history.push("/tutor");
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          {/* <IonListHeader>Inbox</IonListHeader>
          <IonNote>hi@ionicframework.com</IonNote> */}

          <div style={{ marginTop: "20px", marginBottom: "20px" }} > 
            <IonItem lines="full">
              <IonThumbnail className="ion-no-margin">
                {/* <IonImg  src={process.env.PUBLIC_URL + "/cliqclinB_192.png"} /> */}
                <img src={`${config.userIcon}`}  alt="Speaker profile pic" />

              </IonThumbnail>
              <IonLabel className="ion-no-padding ion-no-margin">
                <h1><b>SMFC {userType}</b></h1>
                {/* <IonNote className="ion-no-margin">cliqclin.web.app</IonNote> */}
              </IonLabel>
            </IonItem>
          </div>

          { ( !user || ( user && user.role === "User" ) ) && (
              <IonMenuToggle autoHide={false}>
                <IonItem className={location.pathname === "/home" ? 'selected' : ''} color={location.pathname === "/home" ? config.buttonColor : ''} routerLink="/home" routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor}  slot="start" ios={homeOutline} md={homeSharp} />
                  <IonLabel>Home</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          }

          { user && user.role === "User" && appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} color={location.pathname === appPage.url ? config.buttonColor : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor} slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}

          { user && user.role === "Tutor" && tutorPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} color={location.pathname === appPage.url ? config.buttonColor : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor}  slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          
          {/* Be a Tutor */}
          { /* ( !user || ( user && !user.supplier ) ) && */ (
              <IonMenuToggle autoHide={false}>
                <IonItem className={location.pathname === "/tutor-application" ? 'selected' : ''} color={location.pathname === "/tutor-application" ? config.buttonColor : ''} routerLink="/tutor-application" routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor}  slot="start" ios={peopleOutline} md={peopleSharp} />
                  <IonLabel>Online Registration</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          }
          
{/*       <IonMenuToggle autoHide={false}>
            <IonItem className={location.pathname === "/map" ? 'selected' : ''} color={location.pathname === "/map" ? config.buttonColor : ''} routerLink="/map" routerDirection="none" lines="none" detail={false}>
              <IonIcon color={config.iconColor} slot="start" ios={peopleOutline} md={peopleSharp} />
              <IonLabel>MapTired</IonLabel>
            </IonItem>
          </IonMenuToggle>
 */}          
          {standardPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} color={location.pathname === appPage.url ? config.buttonColor : ''} href={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor}  slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

      </IonContent>

      { user && (

        <IonFooter>
          <IonToolbar>
            {/* Switch to User */}
            { user && user.role === "Tutor" && (
                <IonMenuToggle autoHide={false}>
                  <IonItem color={config.themeColor}  onClick={switctToUser} routerDirection="none" lines="none" detail={false}>
                    <IonIcon color={config.iconColor} slot="start" ios={personOutline} md={personSharp} />
                    <IonLabel>Switch to User</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              )
            }

            {/* Switch to Tutor */}
            { user && user.tutor_id && user.role === "User" && (
                <IonMenuToggle autoHide={false}>
                  <IonItem color={config.themeColor} onClick={switctToTutor} routerDirection="none" lines="none" detail={false}>
                    <IonIcon color={config.iconColor} slot="start" ios={peopleOutline} md={peopleSharp} />
                    <IonLabel>Switch to Tutor</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              )
            }
          </IonToolbar>
        </IonFooter> 
      )}

    </IonMenu>
  );
};

export default Menu;
