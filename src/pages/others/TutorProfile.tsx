import { IonButtons, useIonToast, IonAvatar, IonIcon, IonLoading, IonButton, IonFooter, IonBackButton, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonThumbnail, IonGrid, IonRow, IonCol, IonLabel, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import { useParams } from 'react-router';
// import './Intro.scss';
import React, { useState, useEffect } from "react";
import { accountService } from '../../services/accountService'; 
import { tutorService } from '../../services/tutorService'; 
import Input from "../../components/Input";
// import { object, number } from "yup";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import useFileResize from "../../helpers/fileResize";
import { arrowBackOutline, arrowBackSharp} from 'ionicons/icons'; 
import { fileService } from '../../services/fileService'; 
import { config } from '../../helpers/config';
import { fieldService } from '../../services/fieldService';
import { usePlatform } from '@capacitor-community/react-hooks/platform/usePlatform';
import * as Yup from 'yup';
import useResolver from '../../helpers/resolver';

const TutorProfile: React.FC<any> = () => {

  const { mode } = useParams<any>();
  const [error, setError] = useState("");
  const history = useHistory();
  const [tutor, setTutor] = useState<any>();
  const [ fields, setFields ] = useState<any>();

  const [showLoading, setShowLoading] = useState<any>(false);
  const userDetails = accountService.userValue;
  const [present, dismiss] = useIonToast();
  const [file, setFile] = useState<any>();
  const customActionSheetOptions = { header: 'Service Categories', subHeader: 'Select One' };
  const [services, setServices] = useState<any>([]);
  const categories = [{ id: 1, name: 'IT', }, { id: 2, name: 'Multimedia', }, { id: 3, name: 'Physical Science', }, ];
  const { platform } = usePlatform();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    experience: Yup.string().required('Experience is required'),
  });

  const { control, handleSubmit, errors, reset } = useForm<any>({
    resolver: useResolver(validationSchema),
    defaultValues: tutor
  });

  useEffect(  () => {
    ( async () => {

    const tutor = await accountService.tutorValue;
    setTutor(tutor);
    reset(tutor);

    fieldService.getAll()
    .then( response => { setFields(response); })
    .catch( error => console.log(error) );
    });
    
  },[reset]);

  const clickUpdate = () => {
    var submitButton = window.document.getElementById("submitForm") as HTMLIonButtonElement;
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

    tutorService.update(tutor.id,data)
    .then((tutor) => {
        console.log(tutor);
        setShowLoading(false);
        present("Profile updated Successfully! ", 2000);

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
          <IonButtons slot="start">
              <IonButton onClick={ () => history.goBack() } >
                <IonIcon slot="icon-only" ios={arrowBackOutline} md={arrowBackSharp} />
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

        <div className="ion-padding">
          { error && (<p style={{ textAlign: "center", color: "red"}} >{error}</p>) }

          {/* { tutorDetails && ( */}
            <div>
              
              <IonList>
                <form onSubmit={handleSubmit(update)}>           
                  <Input name="name" label="Name Surname" control={control} errors={errors}  placeholder="John Doe"  />          
                  <Input name="email" label="Email" control={control} errors={errors} type="email" placeholder="john@doe.com" />
                  <Input name="description" label="Modules you tutor" control={control} errors={errors} placeholder="Enter more information here..."
                    Component={IonTextarea}
                  />

                  <IonItem>
                    <IonLabel position="floating"> Category </IonLabel>
                    <Controller control={control} name="category" defaultValue=""
                      render={({ onChange, onBlur, value }) =>  (  
                        <IonSelect value={value} interfaceOptions={customActionSheetOptions} interface="action-sheet" placeholder="Select Multiple" onIonChange={onChange} /* multiple={true} */ >
                          {fields && fields.map( (field:any) => (
                              <IonSelectOption key={field.id} value={field.id}>{field.name}</IonSelectOption>
                          ))}
                        </IonSelect>
                      )}
                    />
                  </IonItem>
                  <Input name="experience" label="Teaching Experience" control={control} errors={errors} 
                  placeholder="Enter experience here..." Component={IonTextarea} />

                  <IonButton id="submitForm" className="ion-hide" type="submit" ></IonButton>
                </form>
              </IonList>
            </div>
          {/* )} */}
          
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
          <IonButton className="ion-margin-horizontal" color={config.buttonColor} expand="full" onClick={clickUpdate}>
          { ( mode && mode === "registration" ) ? "NEXT" : "UPDATE" }
          </IonButton>
        </IonToolbar>
      </IonFooter>

    </IonPage>
  );
};

export default TutorProfile;
