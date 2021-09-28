// import React, { FC } from "react";
import { IonItem, IonSkeletonText, IonList, IonLabel } from "@ionic/react";

const SkeletonLoader = () => {

  const skeletonLoading = () => {
    let children:any = [];

    for( var i = 0; i < 6; i++ ) children.push(<IonItem key={i}>
        <IonLabel>
          <h3> <IonSkeletonText animated style={{ width: '80%' }} /> </h3>
          <p> <IonSkeletonText animated style={{ width: '60%' }} /> </p>
        </IonLabel>
    </IonItem>);

    children = (<IonList>{children}</IonList>);
    return children;
  }

  return ( <> {skeletonLoading()} </> );
}
export default SkeletonLoader;