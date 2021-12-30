import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonText, IonTextarea, IonItemGroup, IonSelect, IonSelectOption, IonButton, IonLoading,
  IonItem, IonLabel, IonDatetime, IonFooter, IonRow, IonIcon, IonCol, IonGrid, IonSearchbar, IonList, IonAvatar, IonCheckbox, IonRadio, IonRadioGroup,
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
import { tutorService } from '../../services/tutorService'; 
import Header from "../../components/Header";
import { config } from "../../helpers/config";
import SkeletonLoader from "../../components/SkeletonLoader";

const SelectTutor: React.FC = () => {

  const [user, setUser] = useState<any>();
  const [tutors, setTutors] = useState<any>([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState<any>();
  const [textArea, setTextArea] = useState<any>();
  const [textAreaError, setTextAreaError] = useState<any>();
  const [wordCount, setWordCount] = useState<any>();
  const minWordCount = 25;
  const [ fields, setFields ] = useState<any>();
  const [fileError, setFileError] = useState("");
  const history = useHistory();
  const [showLoading, setShowLoading] = useState<any>(false);
  const categories = [ { id: 1, name: 'IT', }, { id: 2, name: 'Multimedia', }, { id: 3, name: 'Physical Science', }, ];
  const customActionSheetOptions = { header: 'Category', subHeader: 'Select your Category' };
  const dateTime = new Date().toISOString();
  const [segment, setSegment] = useState('search');
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState();
  const [showAllLoading, setShowAllLoading] = useState<any>(true);

  useEffect( () => {
    ( async () => setUser(await accountService.userValue))();
    setWordCount(minWordCount);

    tutorService.getAll()
    .then( response => { 
      let result = response.filter( (tutor: any) => tutor.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
      setTutors(result); 
      console.log(result); 
      setShowAllLoading(false); 

    }).catch( error => { console.log(error); setShowAllLoading(false); });

    fieldService.getAll()
    .then( response => { console.log(response); setFields(response); })
    .catch( error => console.log(error) );

  }, [searchText]);

  const validationSchema = object().shape({
      title: string().required(),
      date_time: string().required(),
      budget: number().required("Budget is required.").min(200),
      hours: number().required("Number of hours is required.").min(1),
  });
  
  const { control, handleSubmit, errors }:any = useForm({
    resolver: useResolver(validationSchema),
  });

  const countWords = (string: any) => {
    setTextArea(string);
    const str = string.trim().split(" ");
    const diff = minWordCount - str.length;

    diff > -1 ?  setWordCount(diff) : setWordCount(0);
  }

  const fileUploadMultiple = (e:any) => {
    let files = e.target.files;
    if(!files) return;

    const filetype = ['doc', 'docx', 'pdf', 'jpeg','jpg', 'png'];
    let fileSize = 0, fileExtension = '';

    for( var i = 0; i < files.length; i++ ){

      fileExtension = files[i].name.split('.').pop();
      fileSize += Math.round((files[i].size / (1024 * 1024) )); // in Kb => 1024 bytes, Mb => 1024 * 1024 bytes
      if( filetype.indexOf(fileExtension.toLowerCase()) === -1) {
        setFileError("Incompatible files type");
        let docFile = document.getElementById("files") as HTMLFormElement;
        docFile.value = "";
        return;
      } 
    }
    
    if( fileSize > 10 ) setFileError("File is too large.");
    else setFile(files);
  };
  
  const uploadMultiple = (data: any) => {

    console.log(file);
    let formData = new FormData();

    for( var i = 0; i < file.length; i++ ) formData.append("file", file[i] );

    fileService.uploadMultiple(formData)
    .then( response => { console.log(response); postQuestion(data); })
    .catch( error => console.log(error))
  };

  const createQuestion = (data: any) => {
    
    if( wordCount !== 0 ) {
      setTextAreaError(`Minimum words: ${minWordCount}`)
      return;
    }

    setShowLoading(true);
    setError(""); 
      let date = new Date(data.date_time).toString().split(" GMT")[0];
      date = date.slice(0, date.length - 3);
      data.no_of_hours = data.hours;
      delete data.hours;
      data = { ...data, user_id: user.id, status: "Submitted", date_time: date, description: textArea };
      console.log("creating a new user account with: ", data);
      
      if( file ) {        
        let fileNames = [];
        for( var i = 0; i < file.length; i++ ) fileNames.push( file[i].name );
        data["image_name"] = fileNames.toString();
        uploadMultiple(data);
      }
      else postQuestion(data);      
  };

  const postQuestion = (data: any) => {

    questionService.create(data)
    .then( response => { setShowLoading(null); history.push('/question/' + response.id ); })
    .catch( error => {  console.log(error); setError(error); });
  };
  
  const submit = () => {
    var submitButton = document.getElementById("submitButton") as HTMLIonButtonElement;
    submitButton.click();
  };

  return (
    <IonPage>

      <Header name="Select Tutor" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Select Tutor</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div style={ segment === 'search' ?  {} : { display: 'none' }} className="ion-padding">
          <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} placeholder="Type Tutor Name ..." animated showCancelButton="focus" cancelButtonText="Custom Cancel"></IonSearchbar>

          <IonItem lines="full"><IonText color="muted"> <h6 style={{ margin: "0px"}}><b>Tutors</b></h6> </IonText></IonItem>
          <IonList className="ion-no-padding">
            <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
              { tutors.length > 0 && ( tutors.map((tutor:any) => (
                <IonItem className="ion-no-padding" lines="full" key={tutor.id} onClick={ (e) => { }} >
                  <IonAvatar slot="start"><img src={`${config.userIcon}`} alt="Speaker profile pic" /></IonAvatar>
                  <IonLabel>
                    <h2>{tutor.name}</h2>
                    <h6 style={{ opacity: ".5" }}>{tutor.category}</h6>
                  </IonLabel>
                  <IonRadio slot="end" value={tutor.id} />
                </IonItem>                          
              )))}
              { !showAllLoading && !tutors.length && (<IonItem>No item Available</IonItem>)}
              {showAllLoading && (<SkeletonLoader />) }

            </IonRadioGroup>
          </IonList>
        </div>

        <div style={ segment === 'form' ?  {} : { display: 'none' }} className="ion-padding">
          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

          <form onSubmit={handleSubmit(createQuestion)}>  
            <Input name="title" label="Title" control={control} errors={errors} placeholder="COS 212 Assignment 1"  />
            <IonItem>
              <IonLabel position="floating"> Description (Minimum words: {wordCount}) </IonLabel>
              <IonTextarea required onClick={() => setTextAreaError('')} onIonChange={e => countWords(e.detail.value)} />
            </IonItem>
            {textAreaError && (
              <IonText color="danger" className="ion-padding-start">
                <small><span > {textAreaError}</span></small>
              </IonText>
            )}
            
            {errors && errors.category && (
              <IonText color="danger" className="ion-padding-start">
                <small><span role="alert" id={`categoryError`}> {errors.category.message}</span></small>
              </IonText>
            )}
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
                <input multiple id="file" type="file" onClick={() => setFileError("")} onChange={(e:any) => fileUploadMultiple(e)} />
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
        { ( segment === "search" ) ? 
          ( <IonButton disabled={ selected ? false : true } color={config.buttonColor} onClick={(e) => setSegment("form") }
          expand="block" className="ion-margin"> NEXT </IonButton> )
          :
          ( <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonButton expand="block" color="light" onClick={(e) => setSegment("search") }
                  > PREVIOUS </IonButton>
                </IonCol>
                <IonCol size="6">
                  <IonButton onClick={submit} color={config.buttonColor} expand="block" > Submit </IonButton>                
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </IonToolbar>
      </IonFooter>        

    </IonPage>
  );
};

export default SelectTutor;
