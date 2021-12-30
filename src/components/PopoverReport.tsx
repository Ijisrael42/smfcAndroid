import React from "react";
import { IonItem, IonList } from "@ionic/react";
import { accountService } from '../services/accountService'; 
import { useState, useEffect } from "react";

const PopoverReport: React.FC<{ onHide: () => void; }> = ({ onHide }) => {
  
  const [user, setUser] = useState<any>();
  useEffect( () => { ( async () => setUser(await accountService.userValue) )(); },[]);

  return (<IonList>

    { user && user.role === "Tutor" ? (
        <IonItem routerLink="/report/student" button detail>Report Student</IonItem>
    ): (<IonItem routerLink="/report/tutor" button detail>Report Tutor</IonItem>
    )}
    <IonItem routerLink="/report/session" button detail>Report Session</IonItem>
    <IonItem routerLink="/report/abuse" button detail>Report Abuse</IonItem>
  </IonList>);
};

export default PopoverReport;