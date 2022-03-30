import { IonButtons, IonGrid, IonImg, useIonPopover, IonList, IonItem, IonAvatar, IonText, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonThumbnail, IonButton } from '@ionic/react';
import { useParams } from 'react-router';
import './Page.css';
import PopoverList from "../../components/PopoverList";
import { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import Resizer from "react-image-file-resizer";
import { fileService } from '../../services/fileService'; 

const Upload: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const [user, setUser] = useState();
  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  const [file, setFile] = useState<any>();
  const [fileError, setFileError] = useState("");

  useEffect( () => { ( async () => setUser(await accountService.userValue) )(); },[]);

  const fileUpload = (e:any) => {
    let file = e.target.files[0];
    const filetype = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop();

    console.log(file.name);

    if( filetype.indexOf(fileExtension) === -1) {
      console.log("Incompatible file type");
      setFileError("Incompatible file type");
      let docFile = document.getElementById("file") as HTMLFormElement;
      docFile.value = "";
      
    }
    else setFile(file);//console.log("Compatible file type");

  };
  
  const upload = async () => {

    if (!file) return false;
    const image : any = await resizeFile(file);
    const newFile = dataURIToBlob(image, file.name);
    console.log(newFile);
    let formData = new FormData();
    formData.append("file", newFile);

    fileService.upload(formData)
    .then( response => {
      console.log(response);
      // postQuestion(data);
    })
    .catch( error => console.log(error))
  };

  const resizeFile = (file:any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer( file, 300, 300, "JPEG", 100, 0, (uri) => { resolve(uri); }, "base64" );
  });

  const dataURIToBlob = (dataURI: string, filename:string) => {
    const splitDataURI = dataURI.split(",");
    const byteString = splitDataURI[0].indexOf("base64") >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

    const blob = new Blob([ia], { type: mimeString });
    return new File([blob], filename);

  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>

          { user ? (
            <IonList className="ion-no-padding" slot="end" >
              <IonItem onClick={(e) => present({ event: e.nativeEvent,}) } lines="none" >
                <IonAvatar slot="end">
                  <img src={process.env.PUBLIC_URL + "/img/avatar.png"} alt="Speaker profile pic" />
                </IonAvatar>
              </IonItem>
            </IonList>
          ) :  (
            <IonButtons slot="end" >
              <IonItem lines="none" routerLink="/register" >
                <IonText>SIGN UP</IonText>
              </IonItem>
            </IonButtons>
          )}

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Upload</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <IonItem lines="full">
            <input id="file" type="file" onClick={() => setFileError("")} onChange={(e:any) => fileUpload(e)} />{"(docx,doc,pdf)"}
          </IonItem> 
          <IonButton expand="full" onClick={upload}>SUBMIT</IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Upload;
