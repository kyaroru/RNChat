import React from 'react';
import { Provider } from 'react-redux';
import App from './app';
import createStore from './createStore';
import createReducers from './ducks';
import { initializeFirebaseApp } from './utils/firebase';

class Main extends React.Component {
  componentDidMount() {
    initializeFirebaseApp();
  }

  render() {
    const store = createStore(createReducers());
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Main;
