import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ListView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import isEmpty from 'lodash/isEmpty';
import { Conversation, Message, User, CustomerService } from '../../database';
import * as Colors from '../../themes/colors';
import * as authDucks from '../auth/ducks';
import * as ducks from './ducks';

class ConversationListScreen extends Component {
  static getDataSource() {
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  static splitName(name) {
    let result = '';
    const splitArray = name.split(' ');
    splitArray.forEach((str) => {
      result += str[0];
    });
    return result;
  }

  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderConversations = this.renderConversations.bind(this);
    this.state = {
      conversations: [],
      refreshing: false,
      isLoading: true,
      lastMessages: {},
      users: {},
    };
  }

  componentDidMount() {
    this.getAllConversation();
  }

  onRefresh() {
    const { currentUser } = this.props;
    this.setState({ refreshing: true });
    const fieldName = this.isUser() ? 'userId' : 'csId';
    Conversation.getMoreBy(fieldName, currentUser.id).then((conversations) => {
      this.setState({ conversations });
      this.getLastMessage();
      this.getChatUsers('refreshing');
    });
  }

  getAllConversation() {
    const { currentUser } = this.props;
    if (!isEmpty(currentUser)) {
      const fieldName = this.isUser() ? 'userId' : 'csId';
      Conversation.getMoreBy(fieldName, currentUser.id).then((conversations) => {
        this.setState({ conversations });
        this.getLastMessage();
        this.getChatUsers('isLoading');
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  getChatUsers(loading) {
    const { conversations } = this.state;
    if (!isEmpty(conversations)) {
      this.setState({ [loading]: true });
      conversations.forEach((item) => {
        if (this.isUser()) {
          CustomerService.get(item.csId).then((result) => {
            const users = this.state.users;
            users[item.id] = result;
            this.setState({ users });
            this.setState({ [loading]: false });
          });
        } else {
          User.get(item.userId).then((result) => {
            const users = this.state.users;
            users[item.id] = result;
            this.setState({ users });
            this.setState({ [loading]: false });
          });
        }
      });
    }
  }

  getLastMessage() {
    const { conversations } = this.state;
    if (!isEmpty(conversations)) {
      conversations.forEach((item) => {
        Message.getLastBy(item.id).then((result) => {
          const lastMessages = this.state.lastMessages;
          lastMessages[item.id] = result.message;
          this.setState({ lastMessages });
        });
      });
    }
  }

  openConversation(conversation) {
    const { navigation } = this.props;
    const { users } = this.state;
    this.props.updateTargetUser(users[conversation.id]);
    navigation.navigate('ConversationScreen', { conversation });
  }

  isUser() {
    const { currentUser } = this.props;
    return typeof currentUser.password === 'undefined';
  }

  renderItem(item) {
    const { lastMessages, users } = this.state;
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.openConversation(item)}>
        <View style={styles.item}>
          <View style={styles.avatar}>
            <Text>{users[item.id] && ConversationListScreen.splitName(users[item.id].name)}</Text>
          </View>
          <View style={styles.info}>
            <View style={styles.infoContent}><Text style={{ fontSize: 18 }}>{users[item.id] && users[item.id].name}</Text></View>
            <View style={styles.infoContent}><Text>{lastMessages[item.id] || 'Start conversation now :p'}</Text></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderConversations() {
    const { conversations } = this.state;
    if (conversations.length <= 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ padding: 10 }}>
            <Icon name="comments-o" size={50} color={Colors.primary} />
          </View>
          <Text style={{ color: Colors.primary }}>You have not chat with anyone yet</Text>
        </View>
      );
    }
    return (
      <ListView
        ref={(component) => {
          this.listView = component;
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        dataSource={ConversationListScreen.getDataSource().cloneWithRows(conversations)}
        renderRow={this.renderItem}
        enableEmptySections
      />
    );
  }

  render() {
    const { currentUser } = this.props;
    const { isLoading, refreshing } = this.state;
    return (
      <View style={styles.container}>
        {!isEmpty(currentUser) && !isLoading && this.renderConversations()}
        {isLoading && !refreshing && <ActivityIndicator size="large" style={styles.loading} animating={this.state.isLoading} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  itemContainer: {
    flex: 1,
    padding: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

ConversationListScreen.propTypes = {
  updateTargetUser: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  currentUser: store[authDucks.NAME].currentUser,
});

const mapDispatchToProps = {
  updateTargetUser: ducks.updateTargetUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConversationListScreen);
