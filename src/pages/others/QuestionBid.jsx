import { IonButtons,  IonButton, IonBadge, IonText, IonIcon, IonFooter, IonLoading, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonBackButton } from '@ionic/react';
import { useParams, useLocation } from 'react-router';
// import './Intro.scss';
import React, { useState, useEffect } from "react";
import { tutorService } from '../../services/tutorService';
import { accountService } from '../../services/accountService'; 
import { bidService } from '../../services/bidService'; 
import { questionService } from '../../services/questionService';
import { config } from "../../helpers/config";
import { useHistory } from "react-router-dom";
import {checkmarkCircle,arrowBack} from 'ionicons/icons';
import md5 from "md5";
import { fieldService } from '../../services/fieldService'; 
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const QuestionBid = () => {

  const location = useLocation();
  const history = useHistory();
  const { id, status, token, bidid, question_id } = useParams();
  const { email } = accountService.userValue;
  const user = accountService.userValue;
  const tutor = accountService.tutorValue;
  const bid = location.state;//([]);
  const [question, setQuestion] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [field, setField] = useState(null);
  const { platform } = usePlatform();

  // console.log(bid);

  useEffect(() => {
    if( status == "success" ) {

      bidService.getById(bidid)
      .then(bidResponse => {
        console.log(bidResponse);

        if( bidResponse.signature == token )
        {
          update({ status: "Paid", tutor_id: bidResponse.tutor_id, bid_id: bidResponse.id});
          const credit = bidResponse.price - (bidResponse.price * config.serviceFeePercentage);
          tutor.credit = tutor && tutor.credit ? (tutor.credit + credit) : credit;
          creditTutorAccount(bidResponse.tutor_id,{ credit: tutor.credit});
          history.push(`/session/${question_id}` );
        }
      })
      .catch( error => console.log(error) );
    }

  }, []);  

  useEffect(() => {
    questionService.getById(question_id)
    .then( question => {
      setQuestion(question);
      setCategory(question.category);
    }).catch( error =>  console.log(error));

  }, []);  
  
  const update = (data) => {
    bidService.update(bidid, data).then(bid =>console.log(bid)).catch( error => console.log(error) );   
    questionService.update(question_id, data).then( response => console.log(response)).catch( error => console.log(error));
  };

  const creditTutorAccount = (id, data) => {
    tutorService.update(id, data) .then(response =>console.log(response)).catch( error => console.log(error) );   
  };

  const payButton = () => {
    var pData = {
      'merchant_id': '10015619',
      'merchant_key': 'efqwji0808se3',
      'return_url': `${config.appUrl}/question/tutor/${id}/success/${bidid}/${question_id}`,
      'cancel_url': `${config.appUrl}/question/tutor/${id}/cancel/${bidid}/${question_id}`,
      'notify_url': config.appUrl + '/intro',
      'name_first': user.name,
      'email_address': "ijudah42@gmail.com",
      // 'email_address': email,
      'm_payment_id': "1234567",
      'amount': parseFloat(bid.price).toFixed(2),
      'item_name': "COS 212 Assignment 1",
      'item_description': "Assignment Describing the encapsulation of objects",
    };
    var mdData = new URLSearchParams(pData);

    var signature = md5(mdData.toString());
    pData["return_url"] = pData["return_url"] + '/' + signature;
    const data = { signature: signature };

    bidService.update(bid.id, data)
    .then(bids => console.log(bids) )
    .catch( error => console.log(error) );

    mdData = new URLSearchParams(pData);
    pData["signature"] = md5(mdData.toString());

    var str = '<form id="payForm" method="POST" action="https://sandbox.payfast.co.za/eng/process" >';
    for( var name in pData )
      if( pData[name] !== '' ) 
        str += "<input name='" + name + "' type='hidden' value='" + pData[name] + "' />"; 
    str += '</form>'; 

    document.getElementById('payGrid').innerHTML = str;
    document.getElementById('payForm').submit();

  };

  const setCategory = (id) => {
    
    fieldService.getById(id)
    .then( field => {
      console.log( field );
      setField(field);
    })
    .catch( error => console.log(error) );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
          <IonButtons slot="start">
            {/* <IonBackButton defaultHref={`question/${question_id}`} /> */}
            <IonButton onClick={ () => history.goBack()} >
              <IonIcon slot="icon-only" icon={arrowBack} />
            </IonButton> 
          </IonButtons>
          <IonTitle>Tutor Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle size="large">Tutor Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        { status !== 'success' && tutor && field ? 
          (
            <div className="">
              <IonItem>
                <IonLabel>Name</IonLabel><IonText slot="end"><p>{tutor.name}</p></IonText>
              </IonItem>
              <IonItem>
                <IonLabel>Category</IonLabel><IonText slot="end"><p>{field.name}</p></IonText>                  
              </IonItem>                
              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <IonText color="default"><h2>Tutor Modules</h2></IonText>
                  <IonText ><p style={{ wordWrap: "break-word"}}>{tutor.description}</p></IonText>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel className="ion-text-wrap">
                  <IonText color="default"><h2>Experience</h2></IonText>
                  <IonText ><p style={{ wordWrap: "break-word"}}>{tutor.experience}</p></IonText>
                </IonLabel>
              </IonItem>

            </div>
          )
          :
          (
            <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'}
              message={'Please wait...'}
              // duration={5000}
            />
          )
        }      
      </IonContent>

      { status !== 'success' && tutor && (
        <IonFooter>
          <IonToolbar>
            <div className="ion-margin">                
                <IonButton onClick={payButton} value="Pay Now" color="danger" expand="block" className="ion-margin-top">
                PAY NOW
                </IonButton>                            
              <div id="payGrid"></div>
            </div>
          </IonToolbar>
        </IonFooter>  
      )}

    </IonPage>
  );
};

export default QuestionBid;
