import { FC } from "react";
import { IonItem, IonButtons, IonText, IonHeader, IonToolbar, IonMenuButton, IonTitle, IonList, IonAvatar, useIonPopover } from "@ionic/react";
import { config } from "../helpers/config";
import PopoverList from "./PopoverList";

export interface InputProps {
  name: string;
  user: any;
  fullScreen?: boolean;
}

const HeaderMenu: FC<InputProps> = ({ name , user, fullScreen }) => {

  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  const headBody: any = (
    <IonToolbar color={config.themeColor} >
      <IonButtons slot="start">
        <IonMenuButton />
      </IonButtons>
      <IonTitle>{name}</IonTitle>

      { user ? (
        <IonList className="ion-no-padding" slot="end" >
          <IonItem color={config.themeColor} onClick={(e) => present({ event: e.nativeEvent,}) } lines="none" >
            <IonAvatar slot="end">
              <img src={ user.profile_picture ? 
              `${config.apiUrl}/files/image/${user.profile_picture}` : config.userIcon }  alt="Speaker profile pic" />
            </IonAvatar>
          </IonItem>
        </IonList>
      ) :  (
        <IonButtons slot="end" >
          <IonItem color={config.themeColor} lines="none" routerLink="/register" >
            <IonText>SIGN UP</IonText>
          </IonItem>
        </IonButtons>
      )}

    </IonToolbar>
  );

  /* let head:any;
  if( fullScreen ) head = (<IonHeader collapse="condense">{headBody}</IonHeader>);
  else head = (<IonHeader>{headBody}</IonHeader>); */

  const head = (<IonHeader>{headBody}</IonHeader>);
  return (head);
};

export default HeaderMenu;