import { FC } from "react";
import { IonItem, IonButtons, IonText, IonHeader, IonToolbar, IonMenuButton, IonTitle, IonList, IonAvatar, useIonPopover, IonButton } from "@ionic/react";
import { config } from "../helpers/config";
import PopoverList from "./PopoverList";
import { usePlatform } from '@capacitor-community/react-hooks/platform';

export interface InputProps {
  name: string;
  user?: any;
  fullScreen?: boolean;
}

const Header: FC<InputProps> = ({ name , user, fullScreen }) => {

  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  const { platform } = usePlatform();

  return (
    <IonHeader >
      <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" } >

        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{name}</IonTitle>

        { user ? (
          <IonList className="ion-no-padding" slot="end" >
            <IonItem color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" } onClick={(e) => present({ event: e.nativeEvent,}) } lines="none" >
              <IonAvatar slot="end">
                <img src={ user.profile_picture ? 
                `${config.apiUrl}/files/image/${user.profile_picture}` : config.userIcon }  alt="Speaker profile pic" />
              </IonAvatar>
            </IonItem>
          </IonList>
        ) :  (
          <IonButtons slot="end" >
            <IonItem color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" } lines="none" routerLink="/register" >
              <IonText>Sign Up</IonText>
            </IonItem>
          </IonButtons>
        )}

      </IonToolbar>
      
    </IonHeader>
  );
};

export default Header;