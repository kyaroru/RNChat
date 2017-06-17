import { getFirebaseApp } from '../utils/firebase';

const MODEL_NAME = 'user';

// User: { name, email }
export const add = user => new Promise((resolve) => {
  // To create a new User object with auto-generated key
  const firebase = getFirebaseApp();
  const userID = firebase.database().ref().child(MODEL_NAME).push().key;
  const userData = {
    name: user.name,
    email: user.email,
  };
  resolve(update(userID, userData));
});

export const update = (userID, userData) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const updates = {
    [`/${MODEL_NAME}/${userID}`]: userData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const remove = userID => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const userRef = firebase.database().ref(`/${MODEL_NAME}/${userID}`);
  userRef.remove().then(() => {
    resolve();
  });
});

export const getAll = () => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const usersRef = firebase.database().ref(`/${MODEL_NAME}`);
  const users = [];
  usersRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const user = {
        id: childSnapshot.key,
        email: childData.email,
        name: childData.name,
      };
      users.push(user);
    });
    resolve(users);
  });
});
