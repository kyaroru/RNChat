import { getFirebaseApp } from '../utils/firebase';

export const addItem = (modelName, itemData) => new Promise((resolve) => {
  // To create a new object with auto-generated key
  const firebase = getFirebaseApp();
  const itemID = firebase.database().ref().child(modelName).push().key;
  updateItem(modelName, itemID, itemData).then(() => {
    const newItem = {
      id: itemID,
      ...itemData,
    };
    resolve(newItem);
  })
});

export const updateItem = (modelName, itemID, itemData) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const updates = {
    [`/${modelName}/${itemID}`]: itemData,
  };
  firebase.database().ref().update(updates).then(() => {
    resolve();
  });
});

export const removeItem = (modelName, itemID) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const itemRef = firebase.database().ref(`/${modelName}/${itemID}`);
  itemRef.remove().then(() => {
    resolve();
  });
});

export const getAllItems = (modelName) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const itemsRef = firebase.database().ref(`/${modelName}`);
  const items = [];
  itemsRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const item = {
        id: childSnapshot.key,
        ...childData,
      };
      items.push(item);
    });
    resolve(items);
  });
});

export const getItemBy = (modelName, fieldName, value) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const ref = firebase.database().ref();
  const itemRef = ref.child(modelName).orderByChild(fieldName).equalTo(value.toLowerCase());
  itemRef.on('value', (snapshot) => {
    const itemData = snapshot.val();
    if (itemData !== null) {
      const itemID = Object.keys(itemData)[0];
      const item = {
        id: itemID,
        ...itemData[itemID],
      };
      resolve(item);
    } else {
      resolve(null);
    }
  });
});
