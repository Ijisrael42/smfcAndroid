import { IonApp, IonRouterOutlet, IonSplitPane, setupConfig } from '@ionic/react';
// import { IonReactRouter } from '@ionic/react-router';
import { BrowserRouter, Redirect, Route, useHistory } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/sidemenu/Page';
import Home from './pages/sidemenu/Home';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { accountService } from './services/accountService'; 

import Toast from './components/Toast';

import { useClearCache } from 'react-clear-cache';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token, } from '@capacitor/push-notifications';
import { usePlatform } from '@capacitor-community/react-hooks/platform';
import AppUrlListener from './components/AppUrlListener';
import { AppLauncher } from '@capacitor/app-launcher';
import Images from './pages/sidemenu/Images';
import Intro from './pages/sidemenu/Intro';
import Login from './pages/sidemenu/Login';
import MapView from './pages/sidemenu/MapView';
import QuestionList from './pages/sidemenu/QuestionList';
import Sessions from './pages/sidemenu/Sessions';
import TutorApplication from './pages/sidemenu/TutorApplication';
import TutorDashboard from './pages/sidemenu/TutorDashboard';
import TutorQuestionList from './pages/sidemenu/TutorQuestionList';
import TutorQuestion from './pages/others/TutorQuestion';
import TutorRegistration from './pages/sidemenu/TutorRegistration';
import Session from './pages/others/Session';
import TutorSessions from './pages/sidemenu/TutorSessions';
import TutorSession from './pages/others/TutorSession';
import Upload from './pages/sidemenu/Upload';
import Profile from './pages/others/Profile';
import Settings from './pages/others/Settings';
import Question from './pages/others/Question';
import QuestionBid from './pages/others/QuestionBid';
import Register from './pages/others/Register';
import TutorProfile from './pages/others/TutorProfile';
import ContactUs from './pages/sidemenu/ContactUs';
import BankDetails from './pages/others/BankDetails';
import Earnings from './pages/others/Earnings';
import TutorAccount from './pages/sidemenu/TutorAccount';
import Withdrawals from './pages/others/Withdrawals';
import Withdraw from './pages/others/Withdraw';
import LoginTo from './pages/sidemenu/LoginCapacitor';
import LoginCapacitor from './pages/sidemenu/LoginCapacitor';
import RegisterCapacitor from './pages/others/RegisterCapacitor';
import Wallet from './pages/others/Wallet';
import Card from './pages/others/Card';
import SettingsAndroid from './pages/others/SettingsAndroid';
import { useAuth } from './AuthContext';

const IonicAppAndroid: React.FC = () => {

/*   
  useEffect(() => {
    toast(<Toast title="New Notification" body="Notification Body" />, { position: toast.POSITION.TOP_CENTER });
  },[]);
  
  classpath 'com.android.tools.build:gradle:3.6.3'
  distributionUrl=https\://services.gradle.org/distributions/gradle-6.0-bin.zip
  implementation("com.google.firebase:firebase-iid")
  classpath 'com.android.tools.build:gradle:4.1.2'
  classpath 'com.google.gms:google-services:4.3.5'
  distributionUrl=https\://services.gradle.org/distributions/gradle-6.5-all.zip
    <string name="server_client_id">920422764087-iie1obpjqnm6mroqir8n75l2kba6bf4f.apps.googleusercontent.com</string>

  <intent-filter android:autoVerify="true">
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data android:scheme="https" android:host="cliqclin.web.app" />
  </intent-filter>

  package com.smfc.tutors;
  import com.getcapacitor.BridgeActivity;
  import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
  import android.os.Bundle;
  import com.getcapacitor.Plugin;
  import java.util.ArrayList;
  import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
  import com.capacitorjs.plugins.app.AppPlugin;
  public class MainActivity extends BridgeActivity {

      @Override
      public void onCreate(Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);

          this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
              add(GoogleAuth.class);
              add(PushNotificationsPlugin.class);
              add(AppPlugin.class);
          }});
      }
  }

 */
  const { isLatestVersion, emptyCacheStorage } = useClearCache();
  const { platform } = usePlatform();
  let { authUser } = useAuth();  
  const [user, setUser] = useState<any>();
  const [tutor, setTutor] = useState<any>();

  useEffect(async () => {

    if(!isLatestVersion) emptyCacheStorage();

    // Show us the notification payload if the app is open on our device
    if( platform === 'android' || platform === 'ios' ) {

      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          // alert('Push received: ' + JSON.stringify(notification));
          toast(<Toast title={notification.data.title} body={notification.data.body} url={notification.data.click_action} />, { position: toast.POSITION.TOP_CENTER });

        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        async (notification: ActionPerformed) => {
          const { data } = notification.notification;
          window.open(data.click_action,'_system');
        }
      );
    } 

  },[]);

  setupConfig({
    hardwareBackButton: false
  });

  return (
    <IonApp>
      <BrowserRouter>
        <ToastContainer />
        <AppUrlListener></AppUrlListener>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              {/* <Redirect to="/images" /> */}
              <Redirect to="/intro" />
            </Route>

            {/* Side Menu Navigation */}
            <Route path="/home" component={Home} exact={true} />
            <Route path="/intro" component={Intro} exact={true} />
            <Route path="/login" component={LoginCapacitor} exact={true} />
            {/* <Route path="/map" component={MapView} exact={true} /> */}
            <Route path="/page/:name" exact={true}> <Page /> </Route>
            <Route path="/questions" exact={true}> <QuestionList /> </Route>
            <Route path="/sessions" exact={true}> <Sessions /> </Route>
            <Route path="/tutor-application" component={TutorApplication} exact={true} />
            <Route path="/tutor" component={TutorDashboard} exact={true} />
            <Route path="/tutor/questions" component={TutorQuestionList} exact={true} />
            <Route path="/create-profile/:id" exact={true}> <TutorRegistration /> </Route>
            <Route path="/tutor/sessions" exact={true}> <TutorSessions /> </Route>
            <Route path="/contactus" component={ContactUs} exact={true} />
            <Route path="/tutor/account" component={TutorAccount} exact={true} />

            {/* Sub pages */}
            <Route path="/register" component={RegisterCapacitor} exact={true} />
            <Route path="/session/:id" exact={true}> <Session /> </Route>
            <Route path="/tutor/session/:id" exact={true}> <TutorSession /> </Route>
            <Route path="/session/:id/:status" exact={true}> <Session /> </Route>
            <Route path="/tutor/session/:id/:status" exact={true}> <TutorSession /> </Route>
            <Route path="/tutor/question/:id" component={TutorQuestion} exact={true} />
            <Route path="/profile" exact={true}> <Profile /> </Route>
            <Route path="/profile/:mode" exact={true}> <Profile /> </Route>
            <Route path="/settings" exact={true}> <Settings /> </Route>
            <Route path="/settings/:mode" exact={true}> <SettingsAndroid /> </Route>
            <Route path="/question/:id" exact={true}> <Question /> </Route>
            <Route path="/question/tutor/:id/:status/:bidid/:question_id" exact={true}> <QuestionBid /> </Route>
            <Route path="/question/tutor/:id/:status/:bidid/:question_id/:token" exact={true}> <QuestionBid /> </Route>
            <Route path="/tutor/profile" exact={true}> <TutorProfile /> </Route>
            <Route path="/banking-detail" exact={true}> <BankDetails /> </Route>
            <Route path="/banking-detail/:id" exact={true}> <BankDetails /> </Route>
            <Route path="/tutor/earnings" component={Earnings} exact={true} />
            <Route path="/tutor/withdrawals" component={Withdrawals} exact={true} />
            <Route path="/tutor/withdrawal/:id" component={Withdraw} exact={true} />
            <Route path="/wallet" exact={true}> <Wallet /> </Route>
            <Route path="/card" exact={true}> <Card /> </Route>

            {/* Extras */}
            <Route path="/upload" exact={true}> <Upload /> </Route>
            <Route path="/images" component={Images} exact={true} />


          </IonRouterOutlet>
        </IonSplitPane>
      </BrowserRouter>
    </IonApp>
  );
};

export default IonicAppAndroid;
