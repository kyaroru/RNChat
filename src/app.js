import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import * as authDucks from './components/auth/ducks';
import LoginScreen from './components/auth/LoginScreen';
import ConversationScreen from './components/conversation/ConversationScreen';
import Drawer from './components/drawer';

const createStackNavigator = currentUser => StackNavigator({
  LoginScreen: { screen: LoginScreen },
  Drawer: { screen: Drawer },
  ConversationScreen: { screen: ConversationScreen },
}, {
  initialRouteName: isEmpty(currentUser) ? 'LoginScreen' : 'Drawer',
});

class App extends Component {
  render() {
    const { currentUser } = this.props;
    const Navigator = createStackNavigator(currentUser);
    return (
      <Navigator />
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  currentUser: store[authDucks.NAME].currentUser,
});

export default connect(mapStateToProps)(App);
