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
import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { User, CustomerService, Conversation } from '../../database';
import { alert } from '../../utils/alert';
import * as ducks from './ducks';
import * as Colors from '../../themes/colors';

class HomeScreen extends Component {

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

  upsertUser(user) {
    const { updateCurrentUser } = this.props;
    this.setState({ isLoading: true });
    User.getBy('email', user.email).then((userFromDb) => {
      if (userFromDb !== null) {
        alert('Success', 'You have been logged in as User!', 'OK');
        this.setState({ email: null, name: null, password: null, isLoading: false });
        this.clearInput();
        updateCurrentUser(userFromDb);
      } else {
        User.add(user).then((newUser) => {
          alert('Success', 'You have been registered as User!', 'OK');
          this.setState({ email: null, name: null, password: null, isLoading: false });
          this.clearInput();
          updateCurrentUser(newUser);
        });
      }
    });
  }

  upsertCustomerService(customerService) {
    const { updateCurrentUser } = this.props;
    this.setState({ isLoading: true });

    CustomerService.getBy('email', customerService.email).then((userFromDb) => {
      if (userFromDb !== null) {
        if (userFromDb.password === customerService.password) {
          alert('Success', 'You have been logged in as Customer Service Officer!', 'OK');
          this.setState({ email: null, name: null, isLoading: false });
          this.clearInput();
          updateCurrentUser(userFromDb);
        } else {
          alert('Error', 'Your password is incorrect!', 'OK');
          this.setState({ isLoading: false });
        }
      } else {
        CustomerService.add(customerService).then((newCS) => {
          alert('Success', 'You have been registered as Customer Service Officer!', 'OK');
          this.setState({ email: null, name: null, isLoading: false });
          this.clearInput();
          updateCurrentUser(newCS);
        });
      }
    });
  }

  login() {
    if (this.state.selectedTab === 'user') {
      const user = {
        name: this.state.name,
        email: this.state.email.toLowerCase(),
      };
      this.upsertUser(user);
    } else {
      const customerService = {
        name: this.state.name,
        email: this.state.email.toLowerCase(),
        password: this.state.password,
        active: 'false',
      };
      this.upsertCustomerService(customerService);
    }
  }

  logout() {
    const { updateCurrentUser } = this.props;
    updateCurrentUser({});
  }

  startChat() {
    const { navigation, currentUser } = this.props;
    if (this.state.selectedTab === 'user') {
      CustomerService.getMoreBy('active', 'true').then((activeCSs) => {
        if (activeCSs.length > 0) {
          const randomCS = _.sample(activeCSs);
          console.log(`Random Active Customer Service is ${randomCS.name}`);
          const conversation = {
            userId: currentUser.id,
            userName: currentUser.name,
            csId: randomCS.id,
            csName: randomCS.name,
            userId_csId: `${currentUser.id}_${randomCS.id}`,
            startTime: new Date().getTime(),
          };
          Conversation.add(conversation).then((conversationFromDB) => {
            navigation.navigate('ConversationScreen', { conversation: conversationFromDB });
          });
        }
      });
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

  renderUserInfo() {
    const { currentUser } = this.props;
    return (
      <View style={styles.innerContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}>
          <Icon name={this.state.selectedTab === 'user' ? 'user-circle' : 'user-md'} size={100} color={Colors.primary} />
          <Text style={{ fontSize: 20, padding: 5 }}>{currentUser.name}</Text>
          <Text style={{ fontSize: 16 }}>{currentUser.email}</Text>
        </View>
        <View style={[styles.input, { borderColor: Colors.primary }]}>
          <TouchableOpacity style={styles.btnSubmit} onPress={() => this.startChat()}>
            <Text style={{ textAlign: 'center', color: Colors.primary, marginRight: 10 }}>Start Chat!</Text>
            {this.state.isLoading && <ActivityIndicator animating={this.state.isLoading} />}
          </TouchableOpacity>
        </View>
        <View style={[styles.input, { borderColor: Colors.primary, marginTop: 10 }]}>
          <TouchableOpacity style={styles.btnSubmit} onPress={() => this.logout()}>
            <Text style={{ textAlign: 'center', color: Colors.primary, marginRight: 10 }}>Logout</Text>
            {this.state.isLoading && <ActivityIndicator animating={this.state.isLoading} />}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderLogin() {
    return (
      <View style={styles.innerContainer}>
        {HomeScreen.renderInstruction()}
        {this.renderUserTab()}
        {this.renderInput()}
      </View>
    );
  }

  render() {
    const { currentUser } = this.props;
    return (
      <View style={styles.container}>
        {!isEmpty(currentUser) && this.renderUserInfo()}
        {isEmpty(currentUser) && this.props.currentUser && this.renderLogin()}
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

HomeScreen.propTypes = {
  updateCurrentUser: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  currentUser: store[ducks.NAME].currentUser,
});

const mapDispatchToProps = {
  updateCurrentUser: ducks.updateCurrentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
