import { getFirebaseApp } from '../utils/firebase';

const MODEL_NAME = 'conversation';

// User: { name, email }
export const add = conversation => new Promise((resolve) => {
  // To create a new User object with auto-generated key
  const firebase = getFirebaseApp();
  const conversationID = firebase.database().ref().child(MODEL_NAME).push().key;
  const conversationData = {
    userID: conversation.userID,
    startTime: conversation.startTime,
  };
  resolve(update(conversationID, conversationData));
});

export const update = (conversationID, conversationData) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const updates = {
    [`/${MODEL_NAME}/${conversationID}`]: conversationData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const remove = conversationID => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const conversationRef = firebase.database().ref(`/${MODEL_NAME}/${conversationID}`);
  conversationRef.remove().then(() => {
    resolve();
  });
});
