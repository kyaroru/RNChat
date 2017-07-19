import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Icon from 'react-native-vector-icons/FontAwesome';
import isEmpty from 'lodash/isEmpty';
import { User, CustomerService, Device } from '../../database';
import { alert } from '../../utils/alert';
import * as ducks from './ducks';
import * as Colors from '../../themes/colors';
import { getNavigationOptions } from '../../utils/navigation';

class LoginScreen extends Component {
  static validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  static renderInstruction() {
    return (
      <Text style={styles.instructions}>
        Welcome to RNChat. Please input your name & email to get started :p
      </Text>
    );
  }

  constructor() {
    super();
    this.state = {
      selectedTab: 'user',
      email: null,
      name: null,
      password: null,
      isNameFocus: false,
      isEmailFocus: false,
      isPasswordFocus: false,
      isLoading: false,
    };
  }

  clearInput = () => {
    this.nameInput.setNativeProps({ text: '' });
    this.emailInput.setNativeProps({ text: '' });
    if (this.state.selectedTab !== 'user') {
      this.passwordInput.setNativeProps({ text: '' });
    }
  }

  handleLoginSuccess(user) {
    const { updateCurrentUser, currentDevice } = this.props;
    updateCurrentUser(user);
    if (!isEmpty(currentDevice)) {
      const device = {
        userId: user.id,
        deviceId: currentDevice.userId,
      };
      Device.getOneBy(user.id, 'deviceId', currentDevice.userId).then((deviceFromDb) => {
        if (deviceFromDb === null) {
          Device.add(user.id, device).then((newDevice) => {
            console.log(`Device added to user ${user.name}`);
            console.log(newDevice);
          });
        }
      });
    } else {
      console.log('[RNChat] OneSignal Device ID Not Found');
    }
  }

  upsertUser(user) {
    const { navigation } = this.props;
    const { name, email } = this.state;
    this.setState({ isLoading: true });
    User.getBy('email', user.email).then((userFromDb) => {
      if (userFromDb !== null) {
        this.setState({ email: null, name: null, password: null, isLoading: false });
        this.clearInput();
        this.handleLoginSuccess(userFromDb);
      } else {
        if (name === null || name === '') {
          alert('Welcome', 'Since you are new, please enter your name and try again :p', 'OK');
          this.setState({ isLoading: false });
          return;
        }
        if (!LoginScreen.validateEmail(email)) {
          alert('Sorry', 'Please enter a valid email', 'OK');
          this.setState({ isLoading: false });
          return;
        }
        User.add(user).then((newUser) => {
          this.setState({ email: null, name: null, password: null, isLoading: false });
          this.clearInput();
          this.handleLoginSuccess(newUser);
        });
      }
      navigation.navigate('HomeScreen');
    });
  }

  upsertCustomerService(customerService) {
    const { name, email } = this.state;
    this.setState({ isLoading: true });

    CustomerService.getBy('email', customerService.email).then((csFromDb) => {
      if (csFromDb !== null) {
        if (csFromDb.password === customerService.password) {
          this.setState({ email: null, name: null, isLoading: false });
          this.clearInput();
          this.handleLoginSuccess(csFromDb);
        } else {
          alert('Error', 'Your password is incorrect!', 'OK');
          this.setState({ isLoading: false });
        }
      } else {
        if (name === null || name === '') {
          alert('Welcome', 'Since you are new, please enter your name and try again :p', 'OK');
          return;
        }
        if (!LoginScreen.validateEmail(email)) {
          alert('Sorry', 'Please enter a valid email', 'OK');
          this.setState({ isLoading: false });
          return;
        }
        CustomerService.add(customerService).then((newCS) => {
          // alert('Success', 'You have been registered as Customer Service Officer!', 'OK');
          this.setState({ email: null, name: null, isLoading: false });
          this.clearInput();
          this.handleLoginSuccess(newCS);
        });
      }
    });
  }

  login() {
    const { name, email, password, selectedTab } = this.state;
    if (email === null || email === '') {
      alert('Error', 'Please enter your email!', 'OK');
      return;
    }

    if (selectedTab === 'user') {
      const user = {
        name,
        email: email.toLowerCase(),
      };
      this.upsertUser(user);
    } else {
      const customerService = {
        name,
        email: email.toLowerCase(),
        password,
        active: 'false',
      };
      this.upsertCustomerService(customerService);
    }
  }

  renderUserTab() {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => this.setState({ selectedTab: 'user' })} style={styles.tab}>
          <Icon name="user" size={50} color={this.state.selectedTab === 'user' ? Colors.primary : '#ddd'} />
          <Text>User</Text>
        </TouchableOpacity>
        <View style={styles.tabSeparator} />
        <TouchableOpacity onPress={() => this.setState({ selectedTab: 'customerService' })} style={styles.tab}>
          <Icon name="user-md" size={50} color={this.state.selectedTab === 'customerService' ? Colors.primary : '#ddd'} />
          <Text>Customer Service</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderInput() {
    const { isNameFocus, isEmailFocus } = this.state;
    return (
      <View>
        <TextInput
          style={[styles.input, { borderColor: isNameFocus ? 'green' : Colors.primary }]}
          ref={(component) => {
            this.nameInput = component;
          }}
          placeholder="Enter your name"
          underlineColorAndroid="transparent"
          onFocus={() => this.setState({ isNameFocus: true })}
          onBlur={() => this.setState({ isNameFocus: false })}
          onChangeText={name => this.setState({ name })}
        />
        <View style={{ height: 10 }} />
        <TextInput
          style={[styles.input, { borderColor: isEmailFocus ? 'green' : Colors.primary }]}
          ref={(component) => {
            this.emailInput = component;
          }}
          placeholder="Enter your email"
          underlineColorAndroid="transparent"
          onFocus={() => this.setState({ isEmailFocus: true })}
          onBlur={() => this.setState({ isEmailFocus: false })}
          onChangeText={email => this.setState({ email })}
        />
        {this.state.selectedTab !== 'user' && <View style={{ height: 10 }} />}
        {this.state.selectedTab !== 'user' && <TextInput
          style={[styles.input, { borderColor: isEmailFocus ? 'green' : Colors.primary }]}
          ref={(component) => {
            this.passwordInput = component;
          }}
          secureTextEntry
          placeholder="Enter your password"
          underlineColorAndroid="transparent"
          onFocus={() => this.setState({ isPasswordFocus: true })}
          onBlur={() => this.setState({ isPasswordFocus: false })}
          onChangeText={password => this.setState({ password })}
        />}
        <View style={{ height: 10 }} />
        <View style={[styles.input, { borderColor: Colors.primary }]}>
          <TouchableOpacity style={styles.btnSubmit} onPress={() => this.login()}>
            <Text style={{ textAlign: 'center', color: Colors.primary, marginRight: 10 }}>Login/Register</Text>
            {this.state.isLoading && <ActivityIndicator animating={this.state.isLoading} />}
          </TouchableOpacity>
        </View>
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    );
  }

  renderLogin() {
    return (
      <View style={styles.innerContainer}>
        {LoginScreen.renderInstruction()}
        {this.renderUserTab()}
        {this.renderInput()}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLogin()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  innerContainer: {
    width: 300,
  },
  instructions: {
    color: Colors.primary,
    padding: 10,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  tabSeparator: {
    width: 2,
    height: 70,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  btnSubmit: {
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'row',
  },
});

LoginScreen.propTypes = {
  updateCurrentUser: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  currentDevice: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  currentDevice: store[ducks.NAME].currentDevice,
});

const mapDispatchToProps = {
  updateCurrentUser: ducks.updateCurrentUser,
};

LoginScreen.navigationOptions = () => getNavigationOptions('Login', Colors.primary, 'white');

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
