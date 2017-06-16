import App from './app';
import React from 'react';
import { Provider } from 'react-redux';
import createStore from './createStore';
import createReducers from './ducks';

class Main extends React.Component {
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
