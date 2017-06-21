import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import Icon from 'react-native-vector-icons/FontAwesome';
import { User, CustomerService, Conversation } from '../../database';
import * as authDucks from '../auth/ducks';
import * as Colors from '../../themes/colors';

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
  }

  logout() {
    const { updateCurrentUser } = this.props;
    updateCurrentUser({});
  }

  isUser() {
    const { currentUser } = this.props;
    return typeof currentUser.password === 'undefined';
  }

  upsertAndGoToConversation(conversation, userId, csId) {
    const { navigation } = this.props;
    Conversation.getBy('userId_csId', `${userId}_${csId}`).then((conversationFromDB) => {
      if (conversationFromDB !== null) {
        navigation.navigate('ConversationScreen', { conversation: conversationFromDB });
      } else {
        Conversation.add(conversation).then((conversationFromDB) => {
          navigation.navigate('ConversationScreen', { conversation: conversationFromDB });
        });
      }
    });
  }

  startChat() {
    const { currentUser } = this.props;
    if (this.isUser()) {
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
          this.upsertAndGoToConversation(conversation, currentUser.id, randomCS.id);
        }
      });
    } else {
      User.getAll().then((activeUsers) => {
        if (activeUsers.length > 0) {
          const randomUser = _.sample(activeUsers);
          console.log(`Random User is ${randomUser.name}`);
          const conversation = {
            userId: randomUser.id,
            userName: randomUser.name,
            csId: currentUser.id,
            csName: currentUser.name,
            userId_csId: `${randomUser.id}_${currentUser.id}`,
            startTime: new Date().getTime(),
          };
          this.upsertAndGoToConversation(conversation, randomUser.id, currentUser.id);
        }
      });
    }
  }

  renderUserInfo() {
    const { currentUser } = this.props;
    return (
      <View style={styles.innerContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}>
          <Icon name={this.isUser() ? 'user-circle' : 'user-md'} size={100} color={Colors.primary} />
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

  render() {
    const { currentUser } = this.props;
    return (
      <View style={styles.container}>
        {!isEmpty(currentUser) && this.renderUserInfo()}
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
  currentUser: store[authDucks.NAME].currentUser,
});

const mapDispatchToProps = {
  updateCurrentUser: authDucks.updateCurrentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
