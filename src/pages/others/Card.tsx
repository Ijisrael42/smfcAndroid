import { IonButtons, IonIcon, IonButton, IonLoading, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonList, useIonToast, IonFooter } from '@ionic/react';
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams  } from "react-router-dom";
import { arrowBackOutline, arrowBackSharp } from 'ionicons/icons';
import { accountService } from '../../services/accountService'; 
import { config } from '../../helpers/config';
// import Input from '../../components/Input';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import useResolver from '../../helpers/resolver';
import { withdrawalsService } from '../../services/withdrawals';
import { tutorService } from '../../services/tutorService';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';
import Cards from 'react-credit-cards';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-credit-cards/lib/styles.scss';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

const Card: React.FC = () => {

  const [showLoading, setShowLoading] = useState<any>(false);
  const history = useHistory();
  const [present, dismiss] = useIonToast();
  const tutor = accountService.tutorValue;
  const { platform } = usePlatform();

  const [focus, setFocus] = useState<any>();
  const [number, setNumber] = useState<any>("");
  const [name, setName] = useState<any>("");
  const [expiry, setExpiry] = useState<any>("");
  const [cvc, setCvc] = useState<any>("");

  const create = (e:any) => {
    e.preventDefault();
    const data = { number: number, name: name, expiry: expiry, cvc: cvc };
    console.log(data);
    
    /* console.log(data);
    withdrawalsService.create(data)
    .then((withdrawals) => {
        creditTutorAccount(tutor.id, { credit: 0 });
        // const diff = tutor.credit - data.amount; creditTutorAccount(tutor.id, { credit: diff});

        console.log(withdrawals);
        setShowLoading(false);
        present("Banking Details created updated Successfully! ", 2000);
        history.push("/tutor/withdrawals");
     })
    .catch(error => { console.error(error); }); */
  };

  const creditTutorAccount = (id: any, data: any) => {
    tutorService.update(id, data).then(response =>console.log(response)).catch( error => console.log(error) );   
  };

  const submit = () => {
    var submitButton = window.document.getElementById("submitForm") as HTMLIonButtonElement;
    submitButton.click();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
          <IonButtons slot="start">
              <IonButton onClick={ () => history.goBack() } >
                <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
              </IonButton>
          </IonButtons>
          <IonTitle>Card</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle>Card</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">

            <Cards cvc={cvc} expiry={expiry} focused={focus} name={name} number={number} />
            <form onSubmit={ (e) => {create(e)}} style={{ marginTop: "10px"}}>
              <Input type="tel" name="number" placeholder="Card Number" maxLength={18}
              onChange={(e) => setNumber(e.target.value)} onFocus={(e) => setFocus(e.target.name)} required />
              <Input style={{ marginTop: "5px"}} type="text" name="name" placeholder="Card Holder"
              onChange={(e) => setName(e.target.value)} onFocus={(e) => setFocus(e.target.name)} required />
              <Input style={{ marginTop: "5px"}} type="text" name="expiry" placeholder="e.g 02/26"  maxLength={5}
              onChange={(e) => setExpiry(e.target.value)} onFocus={(e) => setFocus(e.target.name)} required />
              <Input style={{ marginTop: "5px"}} type="text" name="cvc" placeholder="..."  maxLength={3}
              onChange={(e) => setCvc(e.target.value)} onFocus={(e) => setFocus(e.target.name)} required />
              <FormGroup style={{ marginTop: "5px"}} check> <Input type="checkbox" />{' '} Save Card for future purchases. </FormGroup>
              <IonButton id="submitForm" className="ion-hide" type="submit" ></IonButton>
            </form>
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton className="ion-margin-horizontal" color={config.buttonColor} expand="full" onClick={submit}>
          SUBMIT
          </IonButton>
        </IonToolbar>
      </IonFooter>

    </IonPage>
  );
};

export default Card;
