import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonText, IonTextarea, IonItemGroup, IonSelect, IonSelectOption, IonButton, IonLoading,
  IonItem, IonLabel, IonDatetime, IonFooter,
} from "@ionic/react";
import React, { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import { object, string, number } from "yup";
import useResolver from "../../helpers/resolver";
import { questionService } from '../../services/questionService';
import { useHistory } from "react-router-dom";
import { accountService } from '../../services/accountService'; 
import { fieldService } from '../../services/fieldService'; 
import { fileService } from '../../services/fileService'; 
import Header from "../../components/Header";
import { config } from "../../helpers/config";

const Home: React.FC = () => {

  const [user, setUser] = useState<any>();
  const [error, setError] = useState("");
  const [file, setFile] = useState<any>();
  const [ fields, setFields ] = useState<any>();
  const [fileError, setFileError] = useState("");
  const history = useHistory();
  const [showLoading, setShowLoading] = useState<any>(false);
  const categories = [ { id: 1, name: 'IT', }, { id: 2, name: 'Multimedia', }, { id: 3, name: 'Physical Science', }, ];
  const customActionSheetOptions = { header: 'Category', subHeader: 'Select your Category' };
  const dateTime = new Date().toISOString();

  useEffect(() => {
    setUser(accountService.userValue);

    fieldService.getAll()
    .then( response => {
      console.log(response);
      setFields(response);
    })
    .catch( error => console.log(error) );

  }, []);

  const validationSchema = object().shape({
      title: string().required(),
      date_time: string().required(),
      description: string().required().min(25),
      category: string().required(),
      budget: number().required("Budget is required.").min(200),
      hours: number().required("Number of hours is required.").min(1),
  });
  
  const { control, handleSubmit, errors }:any = useForm({
    resolver: useResolver(validationSchema),
  });

  const fileUpload = (e:any) => {
    let file = e.target.files[0];
    if(!file) return;

    const filetype = ['doc', 'docx', 'pdf', 'jpeg','jpg', 'png'];
    const fileExtension = file.name.split('.').pop();
    const fileSize = Math.round((file.size / (1024 * 1024) )); // in Kb => 1024 bytes, Mb => 1024 * 1024 bytes
    
    if( filetype.indexOf(fileExtension.toLowerCase()) === -1) {
      setFileError("Incompatible file type");
      let docFile = document.getElementById("file") as HTMLFormElement;
      docFile.value = "";
    } 
    
    if( fileSize > 10 ) setFileError("File is too large.");
    else setFile(file);
  };
  
  const upload = (data: any) => {

    console.log(file);
    let formData = new FormData();
    formData.append("file", file);

    fileService.upload(formData)
    .then( response => {
      console.log(response);
      postQuestion(data);
    })
    .catch( error => console.log(error))

  };

  const createQuestion = (data: any) => {
    
      setShowLoading(true);
      setError(""); 
      let date = new Date(data.date_time).toString().split(" GMT")[0];
      date = date.slice(0, date.length - 3);
      data.no_of_hours = data.hours;
      delete data.hours;
      data = { ...data, user_id: user.id, status: "Submitted", date_time: date };
      console.log("creating a new user account with: ", data);
      
      if( file && file.name ) {
        data["image_name"] = file.name;
        upload(data);
      }
      else postQuestion(data);      
  };

  const postQuestion = (data: any) => {

    questionService.create(data)
    .then( response => {
      setShowLoading(null);
      console.log(response);
      history.push('/question/' + response.id );

    }) .catch( error => {  console.log(error); setError(error); });
  };
  
  const submit = () => {
    var submitButton = document.getElementById("submitButton") as HTMLIonButtonElement;
    submitButton.click();
  };

  return (
    <IonPage>

      <Header name="Home" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div className="ion-padding">
          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }
          <IonText color="muted"> <h3 style={{ margin: "0px"}}>Post A Question</h3> </IonText>

          <form onSubmit={handleSubmit(createQuestion)}>  
            <Input name="title" label="Title" control={control} errors={errors} placeholder="COS 212 Assignment 1"  />
            <Input name="description" label="Description (Minimum words: 25)" control={control} errors={errors} placeholder="Enter more information here..."
              Component={IonTextarea} />
            <IonItem>
              <IonLabel position="floating"> <b>Category</b> </IonLabel>
              <Controller control={control} name="category" defaultValue=""
                render={({ onChange, onBlur, value }:any) => 
                  (  
                  <IonSelect interfaceOptions={customActionSheetOptions} interface="action-sheet" placeholder="Select One"
                    onIonChange={onChange}
                    >
                      {fields && fields.map( (field:any) => (
                          <IonSelectOption key={field.id} value={field.id}>{field.name}</IonSelectOption>
                      ))}
                    </IonSelect>
                )}                
              />
            </IonItem>
            <Input name="budget" label="Budget" type="number" min="1" control={control} errors={errors} placeholder="e.g R200" />
            <IonItem>
              <IonLabel className="ion-margin-vertical"> Date and Time </IonLabel>
              <Controller control={control} name="date_time" defaultValue=""
                render={({ onChange, onBlur, value }:any) => (  
                  <IonDatetime displayFormat="D MMM YYYY H:mm" min={dateTime} onIonChange={onChange}></IonDatetime>
                )}                
              />
            </IonItem>
            <Input name="hours" label="Number of Hours" type="number" control={control} errors={errors} placeholder="e.g 1" />            
            <IonItemGroup>
              
                <IonItem lines="none">
                  <IonLabel color={ fileError ? "danger": "" } >
                    File (docx,doc,pdf,jpeg,jpg,png) { fileError && ( <IonText >Error!</IonText>) }
                  </IonLabel>
                </IonItem>
               
              <IonItem lines="full">
                <input id="file" type="file" onClick={() => setFileError("")} onChange={(e:any) => fileUpload(e)} />
              </IonItem> 
              
            </IonItemGroup>
            <IonButton id="submitButton" type="submit" className="ion-margin ion-hide"></IonButton> 
          </form>

        </div>

        <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            spinner={'bubbles'}
            message={'Please wait...'}
            // duration={5000}
        />
      </IonContent>

      <IonFooter>
        <IonToolbar>
          { user ? (<IonButton onClick={submit} color={config.buttonColor} expand="block" className="ion-margin-horizontal"> Submit </IonButton> ) 
          : (<IonButton color={config.buttonColor} routerLink="/register" expand="block" className="ion-margin-horizontal"> Sign Up to Submit </IonButton>
          )}          
        </IonToolbar>
      </IonFooter>

    </IonPage>
  );
};

export default Home;
