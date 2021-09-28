import {
  IonAvatar,
  IonContent,
  IonFooter,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonToolbar,
} from '@ionic/react';

import { useHistory, useLocation } from 'react-router-dom';
import { callOutline, callSharp, informationCircleOutline, videocamSharp, videocamOutline, bulbSharp, bulbOutline, helpCircleOutline, helpCircleSharp, clipboardOutline, clipboardSharp, personOutline, personSharp, informationCircleSharp, peopleOutline, peopleSharp, homeSharp, homeOutline, logInOutline, logInSharp } from 'ionicons/icons';
import './Menu.css';
import { accountService } from '../services/accountService'; 
import { useAuth } from '../AuthContext'; 
import React/* , { useState, useEffect } */ from "react";
import { config } from '../helpers/config';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const standardPages: AppPage[] = [
  { title: 'About Us', url: '/page/About Us', iosIcon: informationCircleOutline, mdIcon: informationCircleSharp },
  { title: 'Contact Us', url: '/page/Contact Us', iosIcon: callOutline, mdIcon: callSharp },
  { title: 'SIGN IN', url: '/login', iosIcon: logInOutline, mdIcon: logInSharp },
  { title: 'Introduction', url: '/intro', iosIcon: bulbOutline, mdIcon: bulbSharp }
];

const tutorPages: AppPage[] = [
  { title: 'Dashboard', url: '/tutor', iosIcon: clipboardOutline, mdIcon: clipboardSharp },
  { title: 'Questions', url: '/tutor/questions', iosIcon: helpCircleOutline, mdIcon: helpCircleSharp },
  { title: 'Sessions', url: '/tutor/sessions', iosIcon: videocamOutline, mdIcon: videocamSharp },
];

const appPages: AppPage[] = [
  // { title: 'Home', url: '/home', iosIcon: homeOutline, mdIcon: homeSharp },
  { title: 'Posted Questions', url: '/questions', iosIcon: helpCircleOutline, mdIcon: helpCircleSharp },
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
        <IonList id="inbox-list" style={{ padding: "0px"}} >
          <IonItem lines="full">
            <IonAvatar slot="start">
              <img src={`${config.userIcon}`}  alt="Speaker profile pic" />
              {/* <img src={ user.profile_picture ? 
              `${config.apiUrl}/files/image/${user.profile_picture}` : `${process.env.PUBLIC_URL}/img/avatar.png`
              }  alt="Speaker profile pic" /> */}                
            </IonAvatar>
            <IonLabel>
              <h1 style={{ fontSize: "20px", margin: "0px" }} ><b>SMFC { userType }</b></h1>
              <p style={{ opacity: ".5", margin: "0px" }}>SaveMeFromCos</p>
            </IonLabel>
          </IonItem>

          { ( !user || ( user && user.role === "User" ) ) && (
              <IonMenuToggle autoHide={false}>
                <IonItem className={location.pathname === "/home" ? 'selected' : ''} color={location.pathname === "/home" ? config.themeColor : ''} routerLink="/home" routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor}  slot="start" ios={homeOutline} md={homeSharp} />
                  <IonLabel>Home</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          }

          { user && user.role === "User" && appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} color={location.pathname === appPage.url ? config.themeColor : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor} slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          
          { user && user.role === "Tutor" && tutorPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} color={location.pathname === appPage.url ? config.themeColor : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor} slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          
          {/* Be a Tutor */}
          {/* { ( !user || ( user && !user.tutor_id ) ) && ( ) } */}
          <IonMenuToggle autoHide={false}>
            <IonItem className={location.pathname === "/tutor-application" ? 'selected' : ''} color={location.pathname === "/tutor-application" ? config.themeColor : ''} routerLink="/tutor-application" routerDirection="none" lines="none" detail={false}>
              <IonIcon color={config.iconColor} slot="start" ios={peopleOutline} md={peopleSharp} />
              <IonLabel>Online Application</IonLabel>
            </IonItem>
          </IonMenuToggle>
          
          <IonMenuToggle autoHide={false}>
            <IonItem className={location.pathname === "/map" ? 'selected' : ''} color={location.pathname === "/map" ? config.themeColor : ''} routerLink="/map" routerDirection="none" lines="none" detail={false}>
              <IonIcon color={config.iconColor} slot="start" ios={peopleOutline} md={peopleSharp} />
              <IonLabel>MapTired</IonLabel>
            </IonItem>
          </IonMenuToggle>

          
          {standardPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} color={location.pathname === appPage.url ? config.themeColor : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon color={config.iconColor} slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
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
            <IonItem color={config.buttonColor}  onClick={switctToUser} routerDirection="none" lines="none" detail={false}>
              <IonIcon color={config.iconColor} slot="start" ios={personOutline} md={personSharp} />
              <IonLabel>Switch to User</IonLabel>
            </IonItem>
          </IonMenuToggle>
        )
      }

      {/* Switch to Tutor */}
      { user && user.tutor_id && user.role === "User" && (
          <IonMenuToggle autoHide={false}>
            <IonItem color={config.buttonColor} onClick={switctToTutor} routerDirection="none" lines="none" detail={false}>
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
