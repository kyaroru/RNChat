import * as firebase from 'firebase';

let firebaseApp;

const firebaseConfig = {
  apiKey: 'AIzaSyAgdNvb5RFt0-z-JzoLgH1SM_59nSY98Is',
  databaseURL: 'https://rnchat-59a49.firebaseio.com',
  storageBucket: 'rnchat-59a49.appspot.com',
};

export const initializeFirebaseApp = () => {
  if (firebase.apps.length) {
    console.log('[Firebase] Already Initialized');
  } else {
    firebaseApp = firebase.initializeApp(firebaseConfig);
  }
};

export const getFirebaseApp = () => firebaseApp;

export default { initializeFirebaseApp, getFirebaseApp };
