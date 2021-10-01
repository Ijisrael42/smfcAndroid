import { IonButtons, useIonPopover, IonList, IonItem, IonAvatar, IonText, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../../components/ExploreContainer';
import './Page.css';
import { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import Header from '../../components/Header';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const [user, setUser] = useState();
  useEffect( async () => { setUser( await accountService.userValue); }, []);

  return (
    <IonPage>

      <Header name={name} user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} />
      </IonContent>

    </IonPage>
  );
};

export default Page;
