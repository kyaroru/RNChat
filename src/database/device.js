import { addItemWithId, getNestedItemBy, getItemsByParentId, removeItemByParentAndChildId } from './base';

const MODEL_NAME = 'device';

export const add = (id, data) => new Promise((resolve) => {
  resolve(addItemWithId(MODEL_NAME, id, data));
});

// export const update = (id, data) => new Promise((resolve) => {
//   resolve(updateItem(MODEL_NAME, id, data));
// });

// export const remove = id => new Promise((resolve) => {
//   resolve(removeItem(MODEL_NAME, id));
// });

// export const getAll = () => new Promise((resolve) => {
//   resolve(getAllItems(MODEL_NAME));
// });

export const getOneBy = (parentId, fieldName, value) => new Promise((resolve) => {
  resolve(getNestedItemBy(MODEL_NAME, parentId, fieldName, value));
});

export const getMoreBy = parentId => new Promise((resolve) => {
  resolve(getItemsByParentId(MODEL_NAME, parentId));
});

export const removeByParentAndChild = (parentId, childId) => new Promise((resolve) => {
  resolve(removeItemByParentAndChildId(MODEL_NAME, parentId, childId));
});
