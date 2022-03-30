import { FC, useState } from "react";
import { IonItem, IonButtons, IonText, IonHeader, IonLabel, IonToolbar, IonMenuButton, IonTitle, IonList, IonAvatar, useIonPopover, IonButton, IonItemGroup, IonLoading } from "@ionic/react";
import { config } from "../helpers/config";

import { usePlatform } from '@capacitor-community/react-hooks/platform';
import { fileService } from "../services/fileService";
import 'bootstrap/dist/css/bootstrap.css';

const ImageUpload: FC<any> = ({name, error, setFileExt }) => {

  const [file, setFile] = useState<any>(null);
  const [fileError, setFileError] = useState<any>(error);
  const [showLoading, setShowLoading] = useState<any>(false);

  const getFile = (e:any, id:string) => {
    let file = e.target.files[0];
    const filetype = ['png', 'jpg', 'jpeg']; // 'doc', 'docx', 'pdf',
    const fileExtension = file.name.split('.').pop();
  
    if( filetype.indexOf(fileExtension) === -1) return; 
    else return file;
  };

  const fileServiceUpload = async (file:any) => {
    setShowLoading(true);
    let formData = new FormData();
    formData.append("file", file);

    try{
      let response = await fileService.upload(formData);
      setShowLoading(false);
      return response;
    } catch (error) { setShowLoading(false); return error; }
  };

  const fileUpload = (e:any, id:string) => {
    if( !e.target.files[0] ) return;
    const file = getFile(e,id);
    if( !file ) { setFileError("Incompatible file type"); return; }

    const fileSize = Math.round((file.size / (1024 * 1024) )); // in Kb => 1024 bytes, Mb => 1024 * 1024 bytes
    if( fileSize > 10 ) { 
      let docFile = document.getElementById(id) as HTMLFormElement;
      docFile.value = "";
      setFileError("File is too large."); return;
    }
    setFileExt(file);
    setFile(file); fileServiceUpload(file);
  };
  
  const clickCamera = () => {
      const id = name + "Camera";
      var button = window.document.getElementById(id) as HTMLIonInputElement;
      button.click();
      dismiss();
  }

  const clickFolder = () => {
    const id = name + "Folder";
    var button = window.document.getElementById(id) as HTMLIonInputElement;
    button.click();
    dismiss();
  }
  
  const obj = (
    <IonList className="ion-no-padding">
        <IonItem onClick={clickCamera} button detail>Camera</IonItem>
        <IonItem lines="none" onClick={clickFolder} button detail>Files</IonItem>
    </IonList>
  );

  const [present, dismiss] = useIonPopover(obj, { onHide: () => dismiss() });
  const { platform } = usePlatform();

  return (
    <>
      <div className="d-flex justify-content-center" >
        <IonItem lines="none"> 
          { ( platform === 'android' ) ? (
            <IonButton color={config.buttonColor} expand="block"  id="submitForm" onClick={(e) => present({ event: e.nativeEvent,}) } > Choose file </IonButton>          
          ) : (          
            <IonButton color={config.buttonColor} expand="block"  id="submitForm" onClick={clickFolder} > Choose Picture </IonButton>
          )}
    
          <input className="ion-hide" id={name + "Camera"} type="file" accept="image/*, .pdf, .doc, .docx" capture onClick={() => { setFile(""); setFileError("");}} 
          onChange={(e:any) => fileUpload(e,name)} />  

          <input className="ion-hide" id={name + "Folder"} type="file" onClick={() => { setFile(""); setFileError("");}} 
          onChange={(e:any) => fileUpload(e,name)} />  
        </IonItem>
      </div>
      <div className="d-flex justify-content-center ion-text-center" >
        { !file ? "(jpeg, jpg, png) " : (<IonLabel>{file.name}</IonLabel>)}
        { ( fileError && !file ) ? (<IonLabel slot="end" color="danger"> {fileError} </IonLabel>) : (<></>) } 
        { ( error && !file) ? (<IonLabel slot="end" color="danger"> {error} </IonLabel>) : (<></>) } 
      </div>

      <IonLoading  cssClass='my-custom-class' isOpen={showLoading} onDidDismiss={() => setShowLoading(false)}
          spinner={'bubbles'} message={'Please wait...'} /> {/* duration={5000} */} 

    </>);
}

export default ImageUpload;