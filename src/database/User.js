import { getFirebaseApp } from '../utils/firebase';

// User: { name, email }
export const add = user => new Promise((resolve) => {
  // To create a new User object with auto-generated key
  const firebase = getFirebaseApp();
  const userID = firebase.database().ref().child('users').push().key;
  const userData = {
    name: user.name,
    email: user.email,
  };
  const updates = {
    [`/users/${userID}`]: userData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const update = (userID, userData) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const updates = {
    [`/users/${userID}`]: userData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const remove = userID => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const userRef = firebase.database().ref(`/users/${userID}`);
  userRef.remove().then(() => {
    resolve();
  });
});

export const getAll = () => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const usersRef = firebase.database().ref('/users');
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
