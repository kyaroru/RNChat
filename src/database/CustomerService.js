/*
customerService: {
  name,
  email,
  password,
  active,
}
*/
export const add = (firebase, csData) => new Promise((resolve, reject) => {
  // To create a new customerService object with auto-generated key
  const csID = firebase.database().ref().child('customer-service').push().key;
  const updates = {
    [`/customer-service/${csID}`]: csData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const update = (firebase, csID, csData) => new Promise((resolve, reject) => {
  const updates = {
    [`/customer-service/${csID}`]: csData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const remove = (firebase, csID) => new Promise((resolve, reject) => {
  const csRef = firebase.database().ref(`/customer-service/${csID}`);
  csRef.remove().then(() => {
    resolve();
  });
});

export const getAll = (firebase) => new Promise((resolve, reject) => {
  const csRef = firebase.database().ref('/customer-service');
  const customerServices = [];
  csRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const cs = {
        id: childSnapshot.key,
        name: childData.name,
        email: childData.email,
        password: childData.password,
        active: childData.active,
      }
      customerServices.push(cs);
    });
    resolve(customerServices);
  });
});
