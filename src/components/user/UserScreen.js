import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { initializeFirebaseApp } from '../../utils/firebase';
import { getNavigationOptions } from '../../themes/appTheme';
import { User } from '../../database';

class UserScreen extends Component {
  constructor() {
    super();
    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    this.firebase = initializeFirebaseApp();
    this.getAllUsers();
  }

  getAllUsers() {
    User.getAll(this.firebase).then((users) => {
      this.setState({ users });
    });
  }

  addUser(user) {
    User.add(this.firebase, user).then(() => {
      console.log('User is added!');
      this.getAllUsers();
    });
  }

  deleteUser(id) {
    User.remove(this.firebase, id).then(() => {
      console.log('User is removed!');
      this.getAllUsers();
    });
  }

  render() {
    const user = {
      nickname: 'buibui',
      email: 'ibuibui@outlook.com',
    };
    return (
      <View style={styles.container}>
        {this.state.users && this.state.users.map((user) => (
          <View key={user.id}>
            <Text onPress={() => this.deleteUser(user.id)}>{user.nickname}</Text>
          </View>
        ))}
        <Text style={styles.welcome} onPress={() => this.addUser(user)}>
          Add user
        </Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

UserScreen.navigationOptions = getNavigationOptions('Users', '#3498db', 'white');

export default UserScreen;
