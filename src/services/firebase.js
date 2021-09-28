import firebase from 'firebase/app';
import 'firebase/messaging';
import { accountService } from '../services/accountService'; 
import { config } from './config'; 

var firebaseConfig = {
  apiKey: "AIzaSyAjPYLPZnfhQYszOkRp4BcHtEvJc3NJ7js",
  authDomain: "test-f2acb.firebaseapp.com",
  databaseURL: "https://test-f2acb.firebaseio.com",
  projectId: "test-f2acb",
  storageBucket: "test-f2acb.appspot.com",
  messagingSenderId: "920422764087",
  appId: "1:920422764087:web:6c59d61950f847fcaaf9b2"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
else firebase.app(); // if already initialized, use that one

export const messaging = firebase.messaging();

export const getToken = async (setTokenFound) => {
  try {
    const currentToken = await messaging.getToken({ vapidKey: config.vapidKey });
    if (currentToken) {
      console.log('current token for client: ', currentToken);

      const user = accountService.userValue;
      accountService.update(user.id, { device_token: currentToken })
        .then(response => console.log(response, 'success'))
        .catch(error => console.log(error));

      setTokenFound(currentToken);
      //alert("Token Added");

      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
}

export const generateToken = async (setShowLoading) => {
  try {
    setShowLoading(true);
    const currentToken = await messaging.getToken({ vapidKey: config.vapidKey });
    if (currentToken) {
      console.log('current token for client: ', currentToken);

      const user = accountService.userValue;
      accountService.update(user.id, { device_token: currentToken })
      .then(response => {
        console.log(response, 'success');
        setShowLoading(false);
      })
      .catch(error => {
        console.log(error)
        setShowLoading(false);
      });

      // alert("Token Added");

      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');

      // shows on the UI that permission is required 
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});