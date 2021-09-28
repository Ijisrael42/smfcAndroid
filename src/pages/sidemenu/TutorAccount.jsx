import { IonButton, IonText, IonLoading, IonChip, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import './Page.css';
import React, { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import { config } from '../../helpers/config';
import HeaderMenu from '../../components/HeaderMenu';
import md5 from "md5";
import Header from '../../components/Header';
import { bankingdetailsService } from '../../services/bankingdetails';
import { useHistory } from 'react-router';

const TutorAccount = () => {

  const history = useHistory();
  const user = accountService.userValue;
  const tutor = accountService.tutorValue;
  const [showLoading, setShowLoading] = useState();
  const [ bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
    bankingdetailsService.getBySuplierId(tutor.id)
    .then( bankdetails => {
      console.log( bankdetails );
      setBankDetails(bankdetails);setShowLoading(false);
    })
    .catch( error => { setShowLoading(false); console.log(error);} );

  },[]);


  const payButton = () => {
    var pData = {
      'merchant_id': '10015619',
      'merchant_key': 'efqwji0808se3',
      'return_url': `${config.appUrlAlt}/tutor/account`,
      'cancel_url': `${config.appUrlAlt}/tutor/account`,
      'notify_url': config.appUrlAlt + '/intro',
      'name_first': user.name,
      'name_last': "Israel",
      'email_address': user.email,
      'm_payment_id': "1234567",
      'amount': parseFloat(tutor.credit).toFixed(2),
      'item_name': "Credit Account",
      'item_description': "Credit Account Payment",
    };
    var mdData = new URLSearchParams(pData);

    var signature = md5(mdData.toString());

    mdData = new URLSearchParams(pData);
    pData["signature"] = md5(mdData.toString());

    var str = '<form id="payForm" method="POST" action="https://sandbox.payfast.co.za/eng/process" >';
    for( var name in pData )
      if( pData[name] !== '' ) 
        str += "<input name='" + name + "' type='hidden' value='" + pData[name] + "' />"; 
    str += '</form>'; 

    let payGrid = document.getElementById('payGrid');
    payGrid.innerHTML = str;
    let payForm = document.getElementById('payForm');
    payForm.submit();

  };

  return (
    <IonPage>

      <Header name="Account" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        { !showLoading && bankDetails && (
          <div className="">

            <IonItem lines="full"> Status: 
              { tutor && tutor.account_status === "Active" ?  
                (<IonChip color={config.themeColor}><IonLabel> {tutor.account_status} </IonLabel></IonChip>) :  
                (<IonChip><IonLabel> Disabled</IonLabel></IonChip>)
              }            
            </IonItem>
            <IonItem lines="full">
              <IonLabel>Balance: R { tutor && tutor.credit ? tutor.credit : "0.00" }</IonLabel>
            </IonItem>
            <IonItem lines="full">
              <IonText style={{ textAlign: "center", marginTop: "13px" }}>
                <h6 style={{ textAlign: "center", marginLeft: "13px", marginRight: "13px", }}>
                  <b>Payments will made into your provided Banking Account at the end of every 2nd week of the month. </b>
                </h6>
                <h6 style={{ textAlign: "center", marginLeft: "13px", marginRight: "13px", }}>
                  <b>Please remember the Service fee of 5% has been deducted from Balance </b>
                </h6>
              </IonText>
            </IonItem>


            {/* <IonButton onClick={payButton} value="Pay Now" disabled={ tutor && tutor.credit ? false : true } color="danger" expand="block" className="ion-margin">
              PAY NOW
            </IonButton> */}
            { bankDetails ? 
              (<IonButton expand="block" className="ion-margin" onClick={ (e) => { history.push(`/banking-detail/update`, bankDetails ) }} color={config.themeColor} >Banking Details</IonButton>):
              (<IonButton expand="block" className="ion-margin" onClick={ (e) => { history.push(`/banking-detail/create`, { tutor_id: tutor.id} ) }} color={config.themeColor} >Add Banking Details</IonButton>)
            }
            
            {/* bankDetails ? 
              (
                <>
                  <IonButton expand="block" className="ion-margin" routerLink="/tutor/withdrawals" color="danger">Withdrawals</IonButton>
                  <IonButton expand="block" className="ion-margin" onClick={ (e) => { history.push(`/banking-detail/update`, bankDetails ) }} color={config.themeColor} >Banking Details</IonButton>
                </>
              ):
              (<IonButton expand="block" className="ion-margin" onClick={ (e) => { history.push(`/banking-detail/create`, { tutor_id: tutor.id} ) }} color={config.themeColor} >Add Banking Details</IonButton>)
             */}
            <IonButton expand="block" className="ion-margin" routerLink="/tutor/earnings" color={config.buttonColor}>Earnings</IonButton>
            
            <div id="payGrid"></div>
          </div>
        )}

        <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            spinner={'bubbles'}
            message={'Please wait...'}
            duration={5000}
        />
      </IonContent>
    </IonPage>
  );
};

export default TutorAccount;
