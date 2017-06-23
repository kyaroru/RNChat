import { addItem, updateItem, removeItem, getItem, getAllItems, getItemBy, getItemsBy } from './base';

const MODEL_NAME = 'user';

export const add = data => new Promise((resolve) => {
  resolve(addItem(MODEL_NAME, data));
});

export const update = (id, data) => new Promise((resolve) => {
  resolve(updateItem(MODEL_NAME, id, data));
});

export const remove = id => new Promise((resolve) => {
  resolve(removeItem(MODEL_NAME, id));
});

export const getAll = () => new Promise((resolve) => {
  resolve(getAllItems(MODEL_NAME));
});

export const get = id => new Promise((resolve) => {
  resolve(getItem(MODEL_NAME, id));
});

export const getBy = (fieldName, value) => new Promise((resolve) => {
  resolve(getItemBy(MODEL_NAME, fieldName, value));
});

export const getMoreBy = (fieldName, value) => new Promise((resolve) => {
  resolve(getItemsBy(MODEL_NAME, fieldName, value));
});
