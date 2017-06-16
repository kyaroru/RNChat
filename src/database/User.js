/*
user: {
  nickname,
  email,
}
*/
export const add = (firebase, user) => new Promise((resolve, reject) => {
  // To create a new user object with auto-generated key
  const userID = firebase.database().ref().child('users').push().key;
  const userData = {
    nickname: user.nickname,
    email: user.email,
  };
  const updates = {
    [`/users/${userID}`]: userData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const update = (firebase, userID, userData) => new Promise((resolve, reject) => {
  const updates = {
    [`/users/${userID}`]: userData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const remove = (firebase, userID) => new Promise((resolve, reject) => {
  const userRef = firebase.database().ref(`/users/${userID}`);
  userRef.remove().then(() => {
    resolve();
  });
});

export const getAll = (firebase) => new Promise((resolve, reject) => {
  const usersRef = firebase.database().ref('/users');
  const users = [];
  usersRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const user = {
        id: childSnapshot.key,
        email: childData.email,
        nickname: childData.nickname,
      }
      users.push(user);
    });
    resolve(users);
  });
});
