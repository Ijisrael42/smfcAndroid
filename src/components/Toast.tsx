import React, { FC, useState } from "react";
import { IonItem, IonLabel, IonButtons, IonButton, IonIcon, IonInput, IonText, IonAvatar } from "@ionic/react";
import Input from "./Input";
import { useForm, Control, Controller } from "react-hook-form";

import { addCircleOutline, removeCircleOutline, removeCircleSharp, addCircleSharp, chevronForwardOutline, chevronForwardSharp, trashOutline, trashSharp, pricetagsOutline, pricetagsSharp } from 'ionicons/icons';
import { config } from "../helpers/config";

export interface ToastProps {
    title: string;
    body: string;
    url?: string;
}

const Toast: FC<ToastProps> = ({ title , body, url }) => {
  
  return (
    <IonItem routerLink={url} className="ion-no-padding" lines="none" detail >
        <IonAvatar slot="start">
            <img src={config.userIcon}  alt="Speaker profile pic" />
            {/* <img src={ user.profile_picture ? 
            `${config.apiUrl}/files/image/${user.profile_picture}` : `${process.env.PUBLIC_URL}/img/avatar.png`
            }  alt="Speaker profile pic" /> */}                
        </IonAvatar>
        <IonLabel>
            <h2>{title}</h2>
            <h6 style={{ opacity: ".5" }}>{body} </h6>
        </IonLabel>
    </IonItem>
  );
  
};

export default Toast;