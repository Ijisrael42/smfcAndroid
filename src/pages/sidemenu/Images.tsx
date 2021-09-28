import { IonButtons, IonGrid, IonImg, useIonPopover, IonList, IonItem, IonAvatar, IonText, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonThumbnail } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import ExploreContainer from '../../components/ExploreContainer';
import './Page.css';
import PopoverList from "../../components/PopoverList";
import { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import { config } from "../../helpers/config";
import Img from 'react-cool-img';
import Header from '../../components/Header';

const Images: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const [user, setUser] = useState();
  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  const history = useHistory();

  useEffect(() => {
    setUser(accountService.userValue);
  }, []);

  return (
    <IonPage>

      <Header name="Images" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Images</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol onClick={ (e) => { 
                  history.push(`/speaker`, {img: `${config.apiUrl}/files/image/IMG_6533 (2).jpeg/400/300`} )
                }} size='6' sizeLg='3' >
                <Img placeholder={process.env.PUBLIC_URL + "/img/loading.gif"} error={process.env.PUBLIC_URL + "/img/error.png"}
                  src={`${config.apiUrl}/files/image/IMG_6533 (2).jpeg/400/450`} alt="Speaker profile pic" />
              </IonCol>
              <IonCol onClick={ (e) => { 
                  history.push(`/speaker`, {img: `${config.apiUrl}/files/image/IMG_6605.jpeg/400/300`} )
                }} size='6' sizeLg='3' >
                <Img placeholder={process.env.PUBLIC_URL + "/img/loading.gif"} error={process.env.PUBLIC_URL + "/img/error.png"}
                  src={`${config.apiUrl}/files/image/IMG_6605.jpeg/400/450`} alt="Speaker profile pic" />
              </IonCol>
              <IonCol onClick={ (e) => { 
                  history.push(`/speaker`, {img: `${config.apiUrl}/files/image/IMG_5818.jpeg/400/300`} )
                }} size='6' sizeLg='3' >
                <Img placeholder={process.env.PUBLIC_URL + "/img/loading.gif"} error={process.env.PUBLIC_URL + "/img/error.png"}
                  src={`${config.apiUrl}/files/image/IMG_5818.jpeg/400/450`} alt="Speaker profile pic" />
              </IonCol>
              <IonCol onClick={ (e) => { 
                  history.push(`/speaker`, {img: `${config.apiUrl}/files/image/gene-gallin-rGTDvh6qXIc-unsplash.jpg/400/300`} )
                }} size='6' sizeLg='3' >
                <Img placeholder={process.env.PUBLIC_URL + "/img/loading.gif"} error={process.env.PUBLIC_URL + "/img/error.png"}
                  src={`${config.apiUrl}/files/image/gene-gallin-rGTDvh6qXIc-unsplash.jpg/400/450`} alt="Speaker profile pic" />
              </IonCol>
              <IonCol onClick={ (e) => { 
                  history.push(`/speaker`, {img: `${config.apiUrl}/files/image/20210113_132550.jpg/400/300`} )
                }} size='6' sizeLg='3' >
                <Img placeholder={process.env.PUBLIC_URL + "/img/loading.gif"} error={process.env.PUBLIC_URL + "/img/error.png"}
                  src={`${config.apiUrl}/files/image/20210113_132550.jpg/400/450`} alt="Speaker profile pic" />
              </IonCol>
              <IonCol onClick={ (e) => { 
                  history.push(`/speaker`, {img: `${config.apiUrl}/files/image/20210630_084806.jpg/400/300`} )
                }} size='6' sizeLg='3' >
                <Img placeholder={process.env.PUBLIC_URL + "/img/loading.gif"} error={process.env.PUBLIC_URL + "/img/error.png"}
                  src={`${config.apiUrl}/files/image/20210630_084806.jpg/400/450`} alt="Speaker profile pic" />
              </IonCol>
              <IonCol onClick={ (e) => { 
                  history.push(`/speaker`, {img: `${config.apiUrl}/files/image/IMG_6533 (1).jpeg/400/300`} )
                }} size='6' sizeLg='3' >
                <Img placeholder={process.env.PUBLIC_URL + "/img/loading.gif"} error={process.env.PUBLIC_URL + "/img/error.png"}
                  src={`${config.apiUrl}/files/image/IMG_6533 (1).jpeg/400/450`} alt="Speaker profile pic" />
              </IonCol>
            </IonRow>
          </IonGrid>


        </div>

      </IonContent>

    </IonPage>
  );
};

export default Images;
