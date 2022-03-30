import { IonButtons, IonIcon, IonButton, IonLoading, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonList, useIonToast, IonFooter } from '@ionic/react';
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams  } from "react-router-dom";
import { arrowBackOutline, arrowBackSharp } from 'ionicons/icons';
import { accountService } from '../../services/accountService'; 
import { config } from '../../helpers/config';
import Input from '../../components/Input';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import useResolver from '../../helpers/resolver';
import { withdrawalsService } from '../../services/withdrawals';
import { tutorService } from '../../services/tutorService';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const Withdraw: React.FC = () => {

  const [showLoading, setShowLoading] = useState<any>(false);
  const history = useHistory();
  const {state} = useLocation<any>();
  const { bankDetails, withDrawal } = state;
  const {id} = useParams<any>();
  const [present, dismiss] = useIonToast();
  const { platform } = usePlatform();
  const [ tutor, setTutor] = useState<any>();

  /* const validationSchema = Yup.object().shape({
    account_name: Yup.string().required('Account Name is required'),
    account_number: Yup.string().required('Account number is required'),
    bank: Yup.string().required('Account number is required'),
  });

  const { control, handleSubmit, errors } = useForm<any>({
    resolver: useResolver(validationSchema),
    defaultValues: state
  }); */

  useEffect(() => {
    ( async () => {

      const tutor = await accountService.tutorValue;
      setTutor(tutor);
    });
  },[]);

  const create = () => {
    const data = { amount: tutor.credit, supplier_id: tutor.id, bank_id: bankDetails.id, status: "Submitted" };
    console.log(data);
    withdrawalsService.create(data)
    .then((withdrawals) => {
        creditTutorAccount(tutor.id, { credit: 0 });
        // const diff = tutor.credit - data.amount; creditTutorAccount(tutor.id, { credit: diff});

        console.log(withdrawals);
        setShowLoading(false);
        present("Banking Details created updated Successfully! ", 2000);
        history.push("/tutor/withdrawals");
     })
    .catch(error => { console.error(error); });
  };

  const creditTutorAccount = (id: any, data: any) => {
    tutorService.update(id, data).then(response =>console.log(response)).catch( error => console.log(error) );   
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
          <IonTitle>Withdrawal</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle>Withdrawal</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">

          <IonList>
              <IonItem> <IonLabel>Account Name: {bankDetails.account_name}</IonLabel> </IonItem>
              <IonItem> <IonLabel>Account Number: {bankDetails.account_number}</IonLabel> </IonItem>
              <IonItem> <IonLabel>Bank: {bankDetails.bank}</IonLabel> </IonItem>
              <IonItem> <IonLabel>Branch Code: {bankDetails.branch_code}</IonLabel> </IonItem>
              <IonItem> <IonLabel>Account Type: {bankDetails.account_type}</IonLabel> </IonItem>       
              <IonItem color="danger"> 
                { id !== "create" && withDrawal ? 
                  (<IonLabel>Withdrawal Amount: R {withDrawal.amount}</IonLabel>) :
                  (<IonLabel>Withdrawal Amount: R {tutor.credit}</IonLabel>)
                }
              </IonItem>       
          </IonList>

          <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'}
              message={'Please wait...'}
              duration={5000}
          />

        </div>
      </IonContent>
      { id === "create" && (
        <IonFooter>
          <IonToolbar>
            <IonButton className="ion-margin-horizontal" color={config.themeColor} expand="full" onClick={create}>
            CREATE WITHDRAWAL
            </IonButton>
          </IonToolbar>
        </IonFooter>
      )}

    </IonPage>
  );
};

export default Withdraw;
