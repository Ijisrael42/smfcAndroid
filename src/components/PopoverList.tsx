import React from "react";
import { IonItem, IonList } from "@ionic/react";
import { accountService } from '../services/accountService'; 

const PopoverList: React.FC<{ onHide: () => void; }> = ({ onHide }) => {
  
  const user = accountService.userValue;

  return (<IonList>
    { user.role === "Tutor" ? (
        <IonItem routerLink="/tutor/profile" button detail>Tutor Profile</IonItem>
    ): (<IonItem routerLink="/profile" button detail>Profile</IonItem>
    )}
    <IonItem lines="none" routerLink="/settings" detail>Settings</IonItem>
  </IonList>);
};

export default PopoverList;