import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  ToastAndroid,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { confirmation } from './utils/alert';
import { User } from './database';
import * as authDucks from './components/auth/ducks';
import * as conversationDucks from './components/conversation/ducks';
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
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.onNotificationReceived = this.onNotificationReceived.bind(this);
    this.onNotificationOpened = this.onNotificationOpened.bind(this);
    this.onIdsAvailable = this.onIdsAvailable.bind(this);
    this.backButtonExitCount = 0;
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      // 0 - (None) Will not display a notification, instead only onNotificationReceived will fire where you can display your own in app messages.
      // 1 - InAppAlert - (Default) Will display an Android AlertDialog with the message contains.
      // 2 - Notification - Notification will display in the Notification Shade. Same as when the app is not in focus.
      OneSignal.inFocusDisplaying(0);
      BackHandler.addEventListener('backPress', this.handleBackButton);
    }
    OneSignal.addEventListener('received', this.onNotificationReceived);
    OneSignal.addEventListener('opened', this.onNotificationOpened);
    OneSignal.addEventListener('ids', this.onIdsAvailable);
  }

  onIdsAvailable(device) {
    this.props.updateCurrentDevice(device);
  }

  onNotificationReceived(receiveResult) {
    const notification = {
      title: receiveResult.payload.title,
      message: receiveResult.payload.body,
      data: receiveResult.payload.additionalData.p2p_notification,
      isActive: receiveResult.isAppInFocus,
    };
    if (notification.isActive) {
      this.handlePushNotification(notification);
    }
  }

  onNotificationOpened(openResult) {
    const notification = {
      title: openResult.notification.payload.title,
      message: openResult.notification.payload.body,
      data: openResult.notification.payload.additionalData.p2p_notification,
      isActive: openResult.notification.isAppInFocus,
    };
    this.handlePushNotification(notification);
  }

  handlePushNotification(notification) {
    const conversation = notification.data;
    const callback = () => {
      User.get(conversation.userId).then((userFromDB) => {
        this.props.updateTargetUser(userFromDB);
        const navigateAction = NavigationActions.navigate({
          routeName: 'ConversationScreen',
          params: {
            conversation: notification.data,
          },
        });
        this.navigation.dispatch(navigateAction);
      });
    };
    confirmation('Notification', notification.message, 'Start Chat', 'Cancel', callback);
  }

  handleBackButton() {
    if (this.navigation && this.navigation.state.nav.routes.length > 1) {
      this.navigation.dispatch(NavigationActions.back());
      return true;
    } else if (this.backButtonExitCount === 0) {
      ToastAndroid.show('Press again to Exit.', ToastAndroid.SHORT);
      this.backButtonExitCount = 1;
      setTimeout(() => {
        this.backButtonExitCount = 0;
      }, 1000);
      return true;
    }
    return false;
  }

  render() {
    const { currentUser } = this.props;
    const Navigator = createStackNavigator(currentUser);
    return (
      <Navigator ref={(nav) => { this.navigation = nav; }} />
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object.isRequired,
  updateCurrentDevice: PropTypes.func.isRequired,
  updateTargetUser: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  currentUser: store[authDucks.NAME].currentUser,
});

const mapDispatchToProps = {
  updateCurrentDevice: authDucks.updateCurrentDevice,
  updateTargetUser: conversationDucks.updateTargetUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
