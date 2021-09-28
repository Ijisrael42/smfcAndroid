import React, { FC } from "react";
import { IonItem, IonLabel, IonInput, IonText, IonCheckbox } from "@ionic/react";
import {
  Controller,
  Control
} from "react-hook-form";

export interface InputProps {
  name: string;
  type?: any;
  placeholder?: string;
  control?: Control;
  label?: string;
  Component?: React.ElementType;
  errors?: any;
  min?: any;
  // rules?: any;
}

const Input: FC<InputProps> = ({ name, control, Component, label, errors, type, placeholder, min /* , rules */ }) => {
  return (
    <>
      <IonItem>
        {label && <IonLabel position="floating">{label}</IonLabel>}
        {( Component === IonCheckbox ) && (<div style={{ marginBottom: "20px"}}></div>) }

        <Controller
          render={({ onChange, onBlur, value }) => 
            ( Component ? 
            
              ( 
                ( Component === IonCheckbox ) ? 
                    (<IonCheckbox value="1" onIonChange={onChange} />)
                    :
                    (<Component 
                    type={ type ? type : 'text' } 
                    placeholder={ placeholder ? placeholder : '' } 
                    onIonChange={onChange}
                    value={value}
                    min={min}
                    />) 
              )
              :
              <IonInput 
                type={ type ? type : '' } 
                placeholder={ placeholder ? placeholder : '' } 
                onIonChange={onChange}
                value={value}
                /> 

          )}
          control={control}
          name={name}
          defaultValue={ type === "number" ? 0 : '' }
          // rules={rules}          
        />
      </IonItem>
      {errors && errors[name] && (
        <IonText color="danger" className="ion-padding-start">
          <small>
            <span role="alert" id={`${name}Error`}>
              {errors[name].message}
            </span>
          </small>
        </IonText>
      )}
    </>
  );
  /* return (
    <>
      <IonItem>
        {label && <IonLabel position="floating">{label}</IonLabel>}
        <Controller
          as={
            component ?? (
              <IonInput
                aria-invalid={errors && errors[name] ? "true" : "false"}
                aria-describedby={`${name}Error`}
              />
            )
          }
          defaultValue=""
          name={name}
          control={control}
          onChangeName="onIonChange"
        />
      </IonItem>
      {errors && errors[name] && (
        <IonText color="danger" className="ion-padding-start">
          <small>
            <span role="alert" id={`${name}Error`}>
              {errors[name].message}
            </span>
          </small>
        </IonText>
      )}
    </>
  ); */
};

export default Input;