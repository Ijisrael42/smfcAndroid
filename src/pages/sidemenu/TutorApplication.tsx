import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonText, IonTextarea, IonItemGroup, IonSelect,
  IonSelectOption, IonButton, IonItem, IonLabel, IonChip, useIonPopover, IonList, IonAvatar, IonSegment, IonSegmentButton, IonFooter, IonLoading, IonIcon
} from "@ionic/react";

import React, { useState, useEffect, useRef } from "react";
import Input from "../../components/Input";
import { object, string, array } from "yup";
import useResolver from "../../helpers/resolver";
import { useForm, Controller } from "react-hook-form";
import PopoverList from "../../components/PopoverList";
import { accountService } from '../../services/accountService'; 
import { tutorService } from '../../services/tutorService'; 

import './Page.css';
import { fileService } from "../../services/fileService";
import { checkmarkDoneOutline, checkmarkDoneSharp, bugOutline, bugSharp } from "ionicons/icons";
import { config } from "../../helpers/config";
import HeaderMenu from "../../components/HeaderMenu";
import { fieldService } from "../../services/fieldService";
import Header from "../../components/Header";
import FileUpload from "../../components/FileUpload";

const TutorApplication: React.FC = () => {

  const [error, setError] = useState("");
  const [ fields, setFields ] = useState<any>();
  const [idPassportFile, setIdPassportFile] = useState<any>(null);
  const [idPassportFileError, setIdPassportFileError] = useState<any>(null);
  const [trascriptFile, setTrascriptFile] = useState<any>(null);
  const [trascriptFileError, setTrascriptFileError] = useState<any>(null);
  const [companyFile, setCompanyFile] = useState<any>(null);
  const [companyFileError, setCompanyFileError] = useState<any>(null);
  const [sarsFile, setSarsFile] = useState<any>(null);
  const [residenceFile, setResidenceFile] = useState<any>();
  const categories = [{ id: 1, name: 'IT', }, { id: 2, name: 'Multimedia', }, { id: 3, name: 'Physical Science', }, ];
  const customActionSheetOptions = { header: 'Service Categories', subHeader: 'Select One' };
  const [present, dismiss] = useIonPopover(PopoverList, { onHide: () => dismiss() });
  const [showLoading, setShowLoading] = useState<any>(false);
  const [submit, setSubmit] = useState<any>(false);
  const [showSuccess, setShowSuccess] = useState<any>(false);
  const [user, setUser] = useState();
  const ref = useRef<any>(null);

  useEffect( () => { ( async () => {
    setUser(await accountService.userValue);
    fieldService.getAll()
    .then( response => {
      console.log(response);
      setFields(response);
    })
    .catch( error => console.log(error) );
  })(); },[]);
   
  const validationSchema = object().shape({
    name: string().required(),
    email: string().required(),
    description: string().required(),
    category: string().required(),
    experience: string().required().min(25),
  });
  
  const { control, handleSubmit, errors, register, setValue } = useForm({
    resolver: useResolver(validationSchema),
  });
  
  // const apply = async (data: any) => {
  const apply = (data: any) => {

    if( !data.idPassport ) setIdPassportFileError("Upload file");
    if( !data.idPassport ) setTrascriptFileError("Upload file");

    setSubmit(true);
    setShowLoading(true);
    
    const documents = `${data.idPassport},${data.idPassport}`;
    data = { ...data, category: data.category.toString(), application_status: "Submitted", documents: documents };
    console.log("creating a new user account with: ", data);
    // const response = await allFileUpload();
  
    // if( response ) 
    tutorService.create(data)
      .then( response => {
        console.log(response);
        setShowLoading(false);
        setShowSuccess(true);
      })
      .catch( error => { 
        console.log(error);
        setError("Network Error");
        setShowLoading(false);
        setShowSuccess(true);
      });
       
  };
  
  const allFileUpload = async () => {
    
    try {
      let response = await Promise.all([
        fileServiceUpload(companyFile), fileServiceUpload(sarsFile), fileServiceUpload(residenceFile)
      ]);
      if( response[0].message === "success" && response[1].message === "success" && response[2].message === "success" )
      return true;
      else return false;
    } catch (error) { return false; }
  
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
  
  const fileUpload = (e:any, id:string, fileType:any, fileTypeError:any) => {
    if( !e.target.files[0] ) return;
    const file = getFile(e,id);
    if( !file ) { fileTypeError("Incompatible file type"); return; }

    const fileSize = Math.round((file.size / (1024 * 1024) )); // in Kb => 1024 bytes, Mb => 1024 * 1024 bytes
    if( fileSize > 10 ) { 
      let docFile = document.getElementById(id) as HTMLFormElement;
      docFile.value = "";
      fileTypeError("File is too large."); return;
    }
    fileType(file); fileServiceUpload(file);
  };
  
  const getFile = (e:any, id:string) => {
    let file = e.target.files[0];
    const filetype = ['doc', 'docx', 'pdf', 'jpeg','jpg', 'png'];
    const fileExtension = file.name.split('.').pop();
  
    if( filetype.indexOf(fileExtension) === -1) {
      let docFile = document.getElementById(id) as HTMLFormElement;
      docFile.value = "";
    } 
    else return file;
  };
  
  const clickSubmit = () => {
    var submitButton = window.document.getElementById("submitForm") as HTMLIonButtonElement;
    submitButton.click();
  };
  
  return (
    <IonPage>

      <Header name="Application" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Application</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className={ submit ? "ion-hide" : "ion-padding" } >
        
        <form onSubmit={handleSubmit(apply)}> 
          <Input name="name" label="Tutor Name" control={control} errors={errors}  placeholder="John Doe"  />          
          <Input name="email" label="Email" control={control} errors={errors} type="email" placeholder="john@doe.com" />
          <Input name="experience" label="Tutoring Experience" control={control} errors={errors} 
          placeholder="Enter experience here..." Component={IonTextarea} />

          <IonItem>
            <IonLabel position="floating"><b>Tutor Field</b> </IonLabel>
            <Controller control={control} name="category" defaultValue=""
              render={({ onChange, onBlur, value }) =>  (  
                <IonSelect interfaceOptions={customActionSheetOptions} interface="action-sheet" placeholder="Select One" onIonChange={onChange} /* multiple={true} */ >
                  {fields && fields.map( (field:any) => (
                      <IonSelectOption key={field.id} value={field.id}>{field.name}</IonSelectOption>
                  ))}
                </IonSelect>
              )}
            />
          </IonItem>
          <Input name="description" label="Module you tutors" control={control} errors={errors} placeholder="e.g COS 121, WTW 112, etc..."
            Component={IonTextarea}
          />

          <IonItemGroup>
            <FileUpload name="idPassport" description="ID/Passport" error={idPassportFileError} register={register} setValue={setValue} />
            <FileUpload name="trascript" description="Academic Transcript" error={trascriptFileError} register={register} setValue={setValue} />
          </IonItemGroup>
          <IonButton ref={ref} expand="block" type="submit" id="submitForm" className="ion-hide" />
        </form>
        
      </div>
      <div className={ !showSuccess ? "ion-hide container" : "container" } >   
        <>
          <div>
            <IonButton color={config.buttonColor} size="large" >
              <IonIcon slot="icon-only" ios={checkmarkDoneOutline} md={checkmarkDoneSharp} />
            </IonButton>
          </div><br/>
          <IonLabel>Thank you for your Application submission!! We will be in contact with you.</IonLabel>
        </>

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
      
      <IonFooter className={ submit ? "ion-hide" : "" }>
      <IonToolbar >
        <IonButton className="ion-margin-horizontal" color={config.buttonColor} expand="full" onClick={() => ref.current.click()} >Submit</IonButton>
      </IonToolbar>
    </IonFooter>

    </IonPage>
  );
};

export default TutorApplication;
