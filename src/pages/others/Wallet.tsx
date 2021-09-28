import { IonButtons, useIonToast, IonAvatar, IonIcon, IonLoading, IonButton, IonFooter, IonBackButton, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonThumbnail, IonGrid, IonRow, IonCol, IonLabel, IonFab, IonFabButton, IonSegment, IonSegmentButton, IonChip } from '@ionic/react';
import React, { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import { useHistory, useLocation } from "react-router-dom";
import { addCircleOutline, addCircleSharp, arrowBackOutline, arrowBackSharp, cashOutline, cashSharp} from 'ionicons/icons'; 
import { config } from '../../helpers/config';
import SkeletonLoader from '../../components/SkeletonLoader';
import { withdrawalsService } from '../../services/withdrawals';
import { bankingdetailsService } from '../../services/bankingdetails';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const Wallet: React.FC = () => {

  const { state } = useLocation();
  const history = useHistory();
  const [withdrawals, setQuestions] = useState<any>([]);
  const [segment, setSegment] = useState('all');
  const [showLoading, setShowLoading] = useState<any>(false);
  const [showAllLoading, setShowAllLoading] = useState<any>(true);
  const [ bankDetails, setBankDetails] = useState(null);
  const tutor = accountService.tutorValue;
  const { platform } = usePlatform();


  useEffect(() => {
    bankingdetailsService.getBySuplierId(tutor.id)
    .then( bankdetails => {
      console.log( bankdetails );
      setBankDetails(bankdetails);setShowLoading(false);
    })
    .catch( error => { setShowLoading(false); console.log(error);} );

  },[]);

  useEffect(() => {
    setShowLoading(true);
    const tutor = accountService.tutorValue;

    withdrawalsService.getBySuplierId(tutor.id)
    .then( withdrawals => {
        let respondedList:any = [];
        let pendingList:any = [];
        console.log(withdrawals);

        withdrawals.forEach( (withdrawal:any) => {
          if( withdrawal.status === "Responded" ) respondedList.push(withdrawal);
          else if( withdrawal.status === "Submitted" ) pendingList.push(withdrawal);
        })

        setQuestions(withdrawals); 
    }).catch( (error: any) => {
        console.log(error);
    });

  }, []);
  
  const executeTransaction = ( data:any ) => {
    /*  fetch.post( 'https://', data )
     .then() */
   } 

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
          <IonButtons slot="start">
              <IonButton onClick={ () => history.goBack() } >
                <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
              </IonButton>
          </IonButtons>
          <IonTitle>Wallet</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle size="large">Wallet</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="">

          
          <IonList style={ segment === 'all' ?  {} : { display: 'none' }}>
            { 
              withdrawals.length > 0 && ( 
                withdrawals.map( (withdrawal: any) =>  (                  
                  <IonItem key={withdrawal.id} detail 
                  onClick={ (e) => { executeTransaction({ card_id: withdrawal.id, amount: state.amount }) }}  > 
                    <IonIcon slot="start" color={config.buttonColor} ios={cashOutline} md={cashSharp} />
                    <IonLabel>
                      <h2>Withdrawal R {withdrawal.amount}</h2>
                      <h6 style={{ opacity: ".5" }}>{withdrawal.created}</h6>
                    </IonLabel>
                  </IonItem> 
                ))
              ) 
            }
            { !showAllLoading && !withdrawals.length && (<IonItem>No item Available</IonItem>)}
            {showAllLoading && (<SkeletonLoader />) }
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
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color={config.buttonColor} onClick={ (e) => { history.push(`/card`, bankDetails ) }}>
            <IonIcon ios={addCircleOutline} md={addCircleSharp} />
          </IonFabButton>
        </IonFab>

      </IonContent>

    </IonPage>
  );
};

export default Wallet;
