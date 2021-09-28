import { IonButtons, IonText, IonIcon, useIonPopover, IonRow, IonButton, IonBackButton, IonCheckbox, IonFooter, IonLoading, IonSkeletonText, IonThumbnail, IonAvatar, IonLabel, IonSegment, IonSegmentButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonList, IonListHeader } from '@ionic/react';
// import './Page.css';
import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { arrowBackOutline, arrowBackSharp, chevronForwardOutline, chevronForwardSharp } from 'ionicons/icons';
import SkeletonLoader from "../../components/SkeletonLoader";
import { accountService } from '../../services/accountService'; 
import PopoverList from "../../components/PopoverList";
import { bidService } from '../../services/bidService'; 
import { config } from '../../helpers/config';
import HeaderMenu from '../../components/HeaderMenu';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';

const Earnings: React.FC = () => {

  const user = accountService.userValue;
  const history = useHistory();
  const [products, setProducts] = useState<any>([]);
  const [list, setList] = useState<any>(null);
  const {state} = useLocation<any>();
  const supplier = state;
  const [showLoading, setShowLoading] = useState<any>(false);
  const [showAllLoading, setShowAllLoading] = useState<any>(true);
  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  const { platform } = usePlatform();

  useEffect(() => {
    setShowLoading(true);

    // bidService.getBySupplierStatusId( user.supplier, "Completed")
    bidService.getByVariable({ tutor_id: user.tutor_id, status: "Complete"})
    .then( bids => {
      setShowLoading(false);
      console.log(bids);

      let list:any = [];

      bids.forEach( (bid:any) => {
        let created = new Date(bid.created).toLocaleDateString();
        if( !list[created] ) list[created] = [bid];
        else list[created].push(bid);
      });

      let final:any = [];
      let total:Number;
      for( let index in list ) {
        total = 0;
        list[index].forEach( (item:any) => total += item.price );
        final.push({ date: index, bids: list[index], total: total});
      }        
      setList(final);
      setShowAllLoading(false);

    }).catch( (error: any) => { console.log(error); });

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
          <IonTitle>Earnings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle>Earnings</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <IonList>
            { 
              list && list.length > 0 && ( 
                list.map( (item: any, key:any) =>  {
                  let bids = item.bids.map((bid: any, key:any) => (
                    <IonItem key={key} >
                      <IonLabel>
                        <span style={{ fontSize: '15px' }}>{bid.supplier_name} </span>
                        <span style={{ float: "right", fontSize: '15px' }}>
                          <span style={{ color: "green" }}><b> R {bid.price - (bid.price*config.serviceFeePercentage)} </b></span>
                          
                          {/* <span style={{ color: "green" }}><b> + R {bid.total} </b></span>
                          <span style={{ color: "red" }}><b> - R {(bid.total*0.15)}</b></span> */}
                        </span>
                        <h6 style={{ opacity: ".5" }}>{bid.created} </h6>
                      </IonLabel>
                    </IonItem> 
                  ));

                  return (
                    <div key={key}>
                      <IonListHeader color={config.buttonColor}> 
                        <IonLabel>
                          <span style={{ fontSize: '18px'}}>
                            <span>{item.date} </span>
                            <span style={{ float: "right", marginRight: "15px" }}>
                              R {item.total - (item.total*config.serviceFeePercentage)}
                            </span>
                          </span>
                        </IonLabel> 
                      </IonListHeader>
                      {bids}
                    </div>
                  );

                })
              ) 
            }
            { !showAllLoading && !list.length && (<IonItem>No item Available</IonItem>)}
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
          
          {/* <IonList style={ segment === 'all' ? { display: 'none' } : {}}>
            <IonItem>No item Available</IonItem>
          </IonList> */}

        </div>
      </IonContent>
      
{/*       <IonFooter>
        <IonToolbar>
            <IonButton expand="block" disabled={ list.length > 0 ? false : true} type="button" onClick={confirm} className="ion-margin">
              SIGN UP TO PROCEED <IonIcon slot="end" ios={chevronForwardOutline} md={chevronForwardSharp} />
            </IonButton>         
        </IonToolbar>
      </IonFooter>
 */}
    </IonPage>
  );
};

export default Earnings;
