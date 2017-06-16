import { getFirebaseApp } from '../utils/firebase';

// CustomerService: { name, email, password, active }
export const add = csData => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  // To create a new CustomerService object with auto-generated key
  const csID = firebase.database().ref().child('customer-service').push().key;
  const updates = {
    [`/customer-service/${csID}`]: csData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const update = (csID, csData) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const updates = {
    [`/customer-service/${csID}`]: csData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const remove = csID => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const csRef = firebase.database().ref(`/customer-service/${csID}`);
  csRef.remove().then(() => {
    resolve();
  });
});

export const getAll = () => new Promise((resolve) => {
  const firebase = getFirebaseApp();
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
      };
      customerServices.push(cs);
    });
    resolve(customerServices);
  });
});
