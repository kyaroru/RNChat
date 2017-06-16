import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { getNavigationOptions } from '../../themes/appTheme';
import RightItem from '../common/RightItem';
import { User } from '../../database';

const navOptions = getNavigationOptions('RNChat', '#3498db', 'white');

const rightItem = navigation => (
  <RightItem iconName="user" onPress={() => navigation.navigate('UserScreen')} />
);

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    ...navOptions,
    headerRight: rightItem(navigation),
  });

  static addUser(user) {
    User.add(user).then(() => {
      console.log('User is added!');
    });
  }

  constructor() {
    super();
    this.state = {
      email: null,
      name: null,
      isNameFocus: false,
      isEmailFocus: false,
    };
  }

  startChat() {
    const user = {
      name: this.state.name,
      email: this.state.email,
    };
    HomeScreen.addUser(user);
  }

  render() {
    const { isNameFocus, isEmailFocus } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={{ color: '#3498db', padding: 10, textAlign: 'center' }}>
            Welcome to RNChat. Please input your name & email to get started :p
          </Text>
          <TextInput
            style={[styles.input, { borderColor: isNameFocus ? 'green' : '#3498db' }]}
            placeholder="Enter your name"
            onFocus={() => this.setState({ isNameFocus: true })}
            onBlur={() => this.setState({ isNameFocus: false })}
            onChangeText={name => this.setState({ name })}
          />
          <View style={{ height: 10 }} />
          <TextInput
            style={[styles.input, { borderColor: isEmailFocus ? 'green' : '#3498db' }]}
            placeholder="Enter your email"
            onFocus={() => this.setState({ isEmailFocus: true })}
            onBlur={() => this.setState({ isEmailFocus: false })}
            onChangeText={email => this.setState({ email })}
          />
          <View style={{ height: 10 }} />
          <View style={[styles.input, { borderColor: '#3498db' }]}>
            <TouchableOpacity style={{ justifyContent: 'center', padding: 10 }} onPress={() => this.startChat()}>
              <Text style={{ textAlign: 'center', color: '#3498db' }}>Start Chat!</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  inputContainer: {
    width: 300,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default HomeScreen;
