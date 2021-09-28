import { IonButtons, useIonToast, IonAvatar, IonIcon, IonLoading, IonButton, IonFooter, IonBackButton, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonThumbnail, IonGrid, IonRow, IonCol, IonLabel, IonFab, IonFabButton, IonSegment, IonSegmentButton, IonChip } from '@ionic/react';
import React, { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import { useHistory } from "react-router-dom";
import { addCircleOutline, addCircleSharp, arrowBackOutline, arrowBackSharp, cashOutline, cashSharp} from 'ionicons/icons'; 
import { config } from '../../helpers/config';
import SkeletonLoader from '../../components/SkeletonLoader';
import { withdrawalsService } from '../../services/withdrawals';
import { bankingdetailsService } from '../../services/bankingdetails';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const Withdrawals: React.FC = () => {

  const history = useHistory();
  const [withdrawals, setQuestions] = useState<any>([]);
  const [responded, setResponded] = useState<any>([]);
  const [pending, setPending] = useState<any>([]);
  const [segment, setSegment] = useState('all');
  const [showLoading, setShowLoading] = useState<any>(false);
  const [showAllLoading, setShowAllLoading] = useState<any>(true);
  const [showPendingLoading, setShowPendingLoading] = useState<any>(true);
  const [showRespondedLoading, setShowRespondedLoading] = useState<any>(true);
  const [ bankDetails, setBankDetails] = useState(null);
  const tutor = accountService.tutorValue;
  const { platform } = usePlatform();

  const loaderOff = () => {
    setShowLoading(false);
    setShowAllLoading(false);
    setShowPendingLoading(false);
    setShowRespondedLoading(false);
  }

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
        setResponded(respondedList);
        setPending(pendingList);
        loaderOff();
    }).catch( (error: any) => {
        console.log(error);
        loaderOff();
    });

  }, []);
  
  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
          <IonButtons slot="start">
              <IonButton onClick={ () => history.goBack() } >
                <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
              </IonButton>
          </IonButtons>
          <IonTitle>Withdrawals</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle size="large">Withdrawals</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="">
          <IonToolbar color={config.themeColor}>
            <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
              {/* <IonBadge color="primary"></IonBadge> */}
              <IonSegmentButton value="all"> 
                { (segment === "all") ? 
                  (<IonChip><IonLabel><b>ALL ({withdrawals.length})</b></IonLabel></IonChip>) : 
                  (<IonLabel  ><b>ALL ({withdrawals.length})</b></IonLabel>) 
                }
              </IonSegmentButton>
              <IonSegmentButton value="pending">
                { (segment === "pending") ? 
                  (<IonChip> <IonLabel><b>PENDING ({pending.length})</b></IonLabel> </IonChip>)  : 
                  (<IonLabel><b>PENDING ({pending.length})</b></IonLabel>) 
                }
              </IonSegmentButton>
              <IonSegmentButton value="responded">
                { (segment === "responded") ? 
                  (<IonChip> <IonLabel><b>PROCESSED ({responded.length})</b></IonLabel></IonChip>)  : 
                  (<IonLabel  ><b>PROCESSED ({responded.length})</b></IonLabel>) 
                }                
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
          
          <IonList style={ segment === 'all' ?  {} : { display: 'none' }}>
            { 
              withdrawals.length > 0 && ( 
                withdrawals.map( (withdrawal: any) =>  (                  
                  <IonItem key={withdrawal.id} detail 
                  onClick={ (e) => { 
                    history.push(`/tutor/withdrawal/${withdrawal.id}`, {bankDetails: bankDetails, withDrawal: withdrawal} )
                  }}  > 
                    <IonIcon slot="start" color={config.themeColor} ios={cashOutline} md={cashSharp} />
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

          <IonList style={ segment === 'responded' ?  {} : { display: 'none' }}>
            { 
              responded.length > 0 && ( 
                responded.map( (withdrawal: any) =>  (
                  <IonItem key={withdrawal.id} detail 
                  onClick={ (e) => { 
                    history.push(`/tutor/withdrawal/${withdrawal.id}`, {bankDetails: bankDetails, withDrawal: withdrawal} )
                  }}  > 
                    <IonIcon slot="start" color={config.themeColor} ios={cashOutline} md={cashSharp} />
                    <IonLabel>
                      <h2>Withdrawal R {withdrawal.amount}</h2>
                      <h6 style={{ opacity: ".5" }}>{withdrawal.created}</h6>
                    </IonLabel>
                  </IonItem> 
                ))
              ) 
            }
            { !showRespondedLoading && !responded.length && (<IonItem>No item Available</IonItem>)}
            {showRespondedLoading && (<SkeletonLoader />) }
          </IonList>

          <IonList style={ segment === 'pending' ?  {} : { display: 'none' }}>
            { 
              pending.length > 0 && ( 
                pending.map( (withdrawal: any) =>  (
                  <IonItem key={withdrawal.id} detail 
                  onClick={ (e) => { 
                    history.push(`/tutor/withdrawal/${withdrawal.id}`, {bankDetails: bankDetails, withDrawal: withdrawal} )
                  }}  >
                    <IonIcon slot="start" color={config.themeColor} ios={cashOutline} md={cashSharp} />
                    <IonLabel>
                      <h2>Withdrawal R {withdrawal.amount}</h2>
                      <h6 style={{ opacity: ".5" }}>{withdrawal.created}</h6>
                    </IonLabel>
                  </IonItem> 
                ))
              ) 
            }
            { !showPendingLoading && !pending.length && (<IonItem>No item Available</IonItem>)}
            {showPendingLoading && (<SkeletonLoader />) }
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
          <IonFabButton disabled={ tutor && tutor.credit ? false : true } color={config.themeColor} onClick={ (e) => { history.push(`/tutor/withdrawal/create`, bankDetails ) }}>
            <IonIcon ios={addCircleOutline} md={addCircleSharp} />
          </IonFabButton>
        </IonFab>

      </IonContent>

    </IonPage>
  );
};

export default Withdrawals;
