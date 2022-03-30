import { IonButtons, useIonToast, IonAvatar, IonIcon, IonLoading, IonButton, IonFooter, IonBackButton, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonThumbnail, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState, useEffect, useRef } from "react";
import { accountService } from '../../services/accountService'; 
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import useFileResize from "../../helpers/fileResize";
import { arrowBackOutline, arrowBackSharp} from 'ionicons/icons'; 
import { fileService } from '../../services/fileService'; 
import { config } from '../../helpers/config';
import * as Yup from 'yup';
import useResolver from '../../helpers/resolver';
import { usePlatform } from '@capacitor-community/react-hooks/platform';
import ImageUpload from '../../components/ImageUpload';

const Profile: React.FC = () => {

  const { platform } = usePlatform();
  const { mode } = useParams<any>();
  const [error, setError] = useState("");
  const history = useHistory();
  const [user, setUser] = useState<any>();
  const [showLoading, setShowLoading] = useState<any>(false);
  const [present, dismiss] = useIonToast();
  const [file, setFile] = useState<any>();
  const [fileError, setFileError] = useState("");
  const ref = useRef<any>(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    address: Yup.string().required('Address is required'),
    contact_no: Yup.string().required('Contact Number is required'),
  });

  const { control, handleSubmit, errors, reset } = useForm<any>({
    resolver: useResolver(validationSchema),
    defaultValues: user
  });

  useEffect( () => {
    ( async () => {

      const userDetails = await accountService.userValue;
      console.log(userDetails);
      setUser(userDetails);
      reset(userDetails);

    })()
  },[reset]);

  const clickUpdate = () => {
    var submitButton = window.document.getElementById("submitForm") as HTMLIonButtonElement;
    submitButton.click();
  };

  const chooseFile = () => {
    setFile("");
    var submitButton = document.getElementById("file") as HTMLIonButtonElement;
    submitButton.click();
  };

  const update = (data: any) => {
    setError("");
    setShowLoading(true);
    console.log(data);

    if( file && file.name ) {
      data["profile_picture"] = file.name;
      upload(data);
    }
    else updateProfile(data);
    
  };

  const fileUpload = (e:any) => {
    let file = e.target.files[0];
    const filetype = ['png', 'jpeg', 'jpg'];
    const fileExtension = file.name.split('.').pop();

    console.log(file.name);

    if( filetype.indexOf(fileExtension) === -1) {
      console.log("Incompatible file type");
      setFileError("Incompatible file type");
      let docFile = document.getElementById("file") as HTMLFormElement;
      docFile.value = "";
      
    } else { 
      console.log("Compatible file type");
      setFile(file);
    }
  };
  
  const upload = async (data: any) => {
    
    const newFile = await useFileResize(file, 300, 300);
    console.log(newFile);
    let formData = new FormData();
    formData.append("file", newFile);

    fileService.upload(formData)
    .then( response => {
      console.log(response);
      updateProfile(data);
    })
    .catch( error => console.log(error));

  };

  const updateProfile = (data: any) => {

    accountService.update(user.id,data)
    .then((user) => {
        console.log(user);
        setShowLoading(false);
        present("Profile updated Successfully! ", 2000);
        if(mode === "registration" || mode === "user") history.push(`/settings/${mode}`)
        history.go(0);
    })
    .catch(error => { 
      typeof null === 'object' ? console.error(error) : setError(error);
     });

  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color={ ( platform === 'android' || platform === 'web' ) ? config.themeColor : "" }>
          { !mode && (<IonButtons slot="start">
              <IonButton onClick={ () => history.goBack() } >
                <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
              </IonButton>
          </IonButtons>)} 
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color={ ( platform === 'ios' ) ? config.themeColor : "" } >
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

          { user && (
            <div>
              <div className="d-flex justify-content-center" >
                <IonAvatar>
                  <img src={ user.profile_picture ? 
                      `${config.apiUrl}/files/image/${user.profile_picture}` : config.userIcon }  alt="Speaker profile pic" />
                </IonAvatar>
              </div>
              <ImageUpload name="avatar" error={fileError} setFileExt={setFile} />

              <IonList>
                <form onSubmit={handleSubmit(update)}>           
                  <Input name="name" label="Name" control={control} errors={errors} placeholder="e.g John Doe" />
                  <Input name="email" label="Email" control={control} errors={errors} type="email" 
                  placeholder="john@doe.com" />
                  <Input name="address" label="Address" control={control} errors={errors} placeholder="e.g 102 Anonymous Str" />
                  <Input name="contact_no" label="Contact No." control={control} errors={errors} type="number" placeholder="e.g 071 234 5678" />
                  <IonButton ref={ref} id="submitForm" className="ion-hide" type="submit" />
                </form>
              </IonList>
            </div>
          )}
          
        </div>

        <IonLoading
              cssClass='my-custom-class'
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={'bubbles'}
              message={'Please wait...'}
              duration={5000}
          />
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton className="ion-margin-horizontal" color={config.buttonColor} expand="full" 
            onClick={() => ref.current.click()}>
          { ( mode && ( mode === "registration" || mode === "user" ) ) ? "NEXT" : "UPDATE" }
          </IonButton>
        </IonToolbar>
      </IonFooter>

    </IonPage>
  );
};

export default Profile;
