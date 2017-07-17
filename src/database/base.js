import { getFirebaseApp } from '../utils/firebase';

let itemListenerRef;

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
  });
});

export const addItemWithId = (modelName, id, itemData) => new Promise((resolve) => {
  // To create a new object with pre-defined key
  const firebase = getFirebaseApp();
  const itemRef = firebase.database().ref().child(modelName);
  const newItemRef = itemRef.child(id).push();
  const itemID = newItemRef.key;
  newItemRef.set(itemData).then(() => {
    const newItem = {
      id: itemID,
      ...itemData,
    };
    resolve(newItem);
  });
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

export const getAllItems = modelName => new Promise((resolve) => {
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

export const getItem = (modelName, id) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const ref = firebase.database().ref();
  const itemRef = ref.child(`${modelName}/${id}`);
  itemRef.once('value', (snapshot) => {
    const itemData = snapshot.val();
    if (itemData !== null) {
      const itemID = snapshot.key;
      const item = {
        id: itemID,
        ...itemData,
      };
      resolve(item);
    } else {
      resolve(null);
    }
  });
});

export const getItemBy = (modelName, fieldName, value) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const ref = firebase.database().ref();
  const itemRef = ref.child(modelName).orderByChild(fieldName).equalTo(value);
  itemRef.once('value', (snapshot) => {
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

export const getItemsBy = (modelName, fieldName, value) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const ref = firebase.database().ref();
  const itemsRef = ref.child(modelName).orderByChild(fieldName).equalTo(value);
  itemsRef.once('value', (snapshot) => {
    const itemData = snapshot.val();
    if (itemData !== null) {
      const items = [];
      Object.keys(itemData).forEach((key) => {
        const item = {
          id: key,
          ...itemData[key],
        };
        items.push(item);
      });
      resolve(items);
    } else {
      resolve([]);
    }
  });
});

export const getItemsByParentId = (modelName, parentId) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const itemsRef = firebase.database().ref(modelName).child(parentId);
  itemsRef.once('value', (snapshot) => {
    const itemData = snapshot.val();
    if (itemData !== null) {
      const items = [];
      Object.keys(itemData).forEach((key) => {
        const item = {
          id: key,
          ...itemData[key],
        };
        items.push(item);
      });
      resolve(items);
    } else {
      resolve([]);
    }
  });
});

export const getNestedItemBy = (modelName, parentId, fieldName, value) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const itemRef = firebase.database().ref(modelName).child(parentId);
  const childRef = itemRef.orderByChild(fieldName).equalTo(value);
  childRef.once('value', (snapshot) => {
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

export const getLastByParentId = (modelName, parentId) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const itemsRef = firebase.database().ref(modelName).child(parentId).limitToLast(1);
  itemsRef.once('value', (snapshot) => {
    const itemData = snapshot.val();
    if (itemData !== null) {
      const items = [];
      Object.keys(itemData).forEach((key) => {
        const item = {
          id: key,
          ...itemData[key],
        };
        items.push(item);
      });
      resolve(items[0]);
    } else {
      resolve({});
    }
  });
});

export const removeItemByParentAndChildId = (modelName, parentId, childId) => new Promise((resolve) => {
  const firebase = getFirebaseApp();
  const itemRef = firebase.database().ref(`/${modelName}/${parentId}/${childId}`);
  itemRef.remove().then(() => {
    resolve();
  });
});

export const onChildAdded = (modelName, value, cb) => {
  const firebase = getFirebaseApp();
  itemListenerRef = firebase.database().ref(modelName).child(value);
  itemListenerRef.on('child_added', cb);
};

export const offChildAdded = () => {
  itemListenerRef.off();
  console.log('off listener');
};
