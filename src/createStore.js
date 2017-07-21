import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
// import mySaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
let middleware;
let store;

/* global __DEV__*/
if (__DEV__) {
  middleware = applyMiddleware(sagaMiddleware, createLogger());
} else {
  middleware = applyMiddleware(sagaMiddleware);
}

export const getStore = () => store;

export default (reducers, data = {}) => {
  store = createStore(reducers, data, compose(
    middleware,
    autoRehydrate(),
  ));
  // sagaMiddleware.run(mySaga);
  persistStore(store, { storage: AsyncStorage });
  return store;
};
