import * as firebase from 'firebase';

let firebaseApp;

const firebaseConfig = {
  apiKey: 'AIzaSyAgdNvb5RFt0-z-JzoLgH1SM_59nSY98Is',
  // authDomain: "<your-auth-domain>",
  databaseURL: 'https://rnchat-59a49.firebaseio.com',
  storageBucket: 'rnchat-59a49.appspot.com',
};

export const initializeFirebaseApp = () => {
  firebaseApp = firebase.initializeApp(firebaseConfig);
};

export const getFirebaseApp = () => firebaseApp;

export default { initializeFirebaseApp, getFirebaseApp };
