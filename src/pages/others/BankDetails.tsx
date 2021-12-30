import { IonButtons, IonIcon, IonButton, IonLoading, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonList, useIonToast, IonFooter } from '@ionic/react';
import React, { useState } from "react";
import { useHistory, useLocation, useParams  } from "react-router-dom";
import { arrowBackOutline, arrowBackSharp } from 'ionicons/icons';
import { accountService } from '../../services/accountService'; 
import { config } from '../../helpers/config';
import Input from '../../components/Input';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import useResolver from '../../helpers/resolver';
import { bankingdetailsService } from '../../services/bankingdetails';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const BankDetails: React.FC = () => {

  const [showLoading, setShowLoading] = useState<any>(false);
  const history = useHistory();
  const {state} = useLocation<any>();
  const {id} = useParams<any>();
  const [present, dismiss] = useIonToast();
  const { platform } = usePlatform();

  const validationSchema = Yup.object().shape({
    account_name: Yup.string().required('Account Name is required'),
    account_number: Yup.string().required('Account number is required'),
    bank: Yup.string().required('Account number is required'),
  });

  const { control, handleSubmit, errors } = useForm<any>({
    resolver: useResolver(validationSchema),
    defaultValues: state
  });

  const submit = (data: any) => {

    setShowLoading(true);
    if( id && ( id === "create" ) ) create(data);
    else update(data);
  };

  const update = (data: any) => {
    data.supplier_id = state.tutor_id;
    bankingdetailsService.update(state.id,data)
    .then((bankingdetails) => {
        console.log(bankingdetails);
        setShowLoading(false);
        present("Banking Details updated updated Successfully! ", 2000);
        history.push("/tutor/account");
    })
    .catch(error => { console.error(error); });
  };

  const create = (data: any) => {
    data.supplier_id = state.tutor_id;
    bankingdetailsService.create(data)
    .then((bankingdetails) => {
        console.log(bankingdetails);
        setShowLoading(false);
        present("Banking Details created updated Successfully! ", 2000);
        history.push("/tutor/account");
     })
    .catch(error => { console.error(error); });
  };

  const clickUpdate = () => {
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
          <IonTitle>Banking Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle>Banking Details</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">

          <IonList>
            <form onSubmit={handleSubmit(submit)}>           
              <Input name="account_name" label="Account Holder" control={control} errors={errors} placeholder="e.g John Doe" />
              <Input name="account_number" label="Account Number" control={control} errors={errors} placeholder="e.g 123456789" />
              <Input name="bank" label="Bank Name" control={control} errors={errors} placeholder="" />
              <Input name="account_type" label="Account Type" control={control} errors={errors} placeholder="e.g Cheque or Savings" />
              <IonButton id="submitForm" className="ion-hide" type="submit" ></IonButton>
            </form>
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
      
      <IonFooter>
        <IonToolbar>
          <IonButton className="ion-margin-horizontal" color={config.buttonColor} expand="full" onClick={clickUpdate}>
          { ( id && ( id === "create" ) ) ? "CREATE" : "UPDATE" } ACCOUNT
          </IonButton>
        </IonToolbar>
      </IonFooter>

    </IonPage>
  );
};

export default BankDetails;
