import { IonGrid, IonLoading, IonRow, IonCard, IonCardContent, IonButton, IonCol, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/react';
import React, { useState, useEffect/* , useRef */ } from "react";
import { questionService } from '../../services/questionService';
import { accountService } from '../../services/accountService'; 
import { tutorService } from '../../services/tutorService';
import { bidService } from '../../services/bidService';
import Header from '../../components/Header';
import { config } from '../../helpers/config';

const TutorDashboard: React.FC = () => {

  const [questions, setQuestions] = useState<any>([]);
  const [posted, setPosted] = useState<any>([]);
  const [bids, setBids] = useState<any>([]);
  const [sessions, setSessions] = useState<any>([]);
  const [scheduled, setScheduled] = useState<any>([]);
  const [complete, setComplete] = useState<any>([]);
  const [showLoading, setShowLoading] = useState<any>(true);

  const [user, setUser] = useState();

  useEffect(() => {
    const user = accountService.userValue;
    const tutor = accountService.tutorValue;
    setUser(user);

    setShowLoading(true);   

    questionService.getByCategory({ category: tutor.category})
    .then(questionlist => {

      bidService.getByTutorId(user.tutor_id)
      .then( bidlist => { 
        setBids(bidlist);
  
        let allList:any = [], scheduleList:any = [], completeList:any = [], unbidded:any = [];

        const bidQuestions = bidlist.map( (bid:any) => bid.question_id );
        questionlist.forEach( (question:any) => {
          if( bidQuestions.indexOf(question.id) === -1 ) unbidded.push(question);

          if( question.status === "Paid" || question.status === "Completed" ) allList.push(question);
          if( question.status === "Paid" ) scheduleList.push(question);
          else if( question.status === "Completed" ) completeList.push(question);

        });

        console.log("Unbidded");
        console.log(unbidded);
        setPosted(unbidded);
        setSessions(allList); 
        setScheduled(scheduleList);
        setComplete(completeList);
        setShowLoading(false);
      }); 

      setQuestions(questionlist); 

    }).catch(err => setShowLoading(false) );

  }, []);

  return (
    <IonPage>

      <Header name="Dashboard" user={user} />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div id="dashboard" className="ion-padding">

          <IonGrid fixed>
            <IonRow>
              <IonCol size="12" size-md="6" >                  
                <IonCard routerLink="/tutor/questions" >
                  <IonItem color={config.buttonColor}>                      
                    <IonLabel><h1 style={{ textAlign: "left" }}>Questions</h1></IonLabel>
                    <IonButton color="light" routerLink="/tutor/questions" fill="outline" slot="end">View</IonButton>
                  </IonItem>

                  <IonCardContent>
                    <div><b>All:</b> {questions.length}</div>
                    <div><b>Unbidded:</b> {posted.length}</div>
                    <div><b>Bids:</b> {bids.length}</div>
                    {/* <div><b>Accepted:</b> 10</div>
                    <div><b>Rejected:</b> 10</div> */}
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" size-md="6" >                  
                <IonCard routerLink="/tutor/sessions">
                  <IonItem  color={config.buttonColor}>                      
                    <IonLabel><h1 style={{ textAlign: "left" }}>Sessions</h1></IonLabel>
                    <IonButton color="light" routerLink="/tutor/sessions" fill="outline" slot="end">View</IonButton>
                  </IonItem>

                  <IonCardContent>
                    <div><b>All:</b> {sessions.length}</div>
                    <div><b>Scheduled:</b> {scheduled.length}</div>
                    <div><b>Completed:</b> {complete.length}</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

            </IonRow>
          </IonGrid>
          
          <IonLoading
            cssClass='my-custom-class'
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            spinner={'bubbles'}
            message={'Please wait...'}
            duration={5000}
        />
        </div>

      </IonContent>
    </IonPage>
  );
};

export default TutorDashboard;
