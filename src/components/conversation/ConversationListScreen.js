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
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import { Conversation, Message } from '../../database';
import * as authDucks from '../auth/ducks';

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
      this.setState({ conversations, refreshing: false });
      this.getLastMessage();
    });
  }

  getAllConversation() {
    const { currentUser } = this.props;
    if (!isEmpty(currentUser)) {
      const fieldName = this.isUser() ? 'userId' : 'csId';
      Conversation.getMoreBy(fieldName, currentUser.id).then((conversations) => {
        this.setState({ conversations });
        this.setState({ isLoading: false });
        this.getLastMessage();
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  getAvatarName(item) {
    return this.isUser() ? ConversationListScreen.splitName(item.csName) : ConversationListScreen.splitName(item.userName);
  }

  getDisplayName(item) {
    return this.isUser() ? item.csName : item.userName;
  }

  getLastMessage() {
    const { conversations } = this.state;
    if (!isEmpty(conversations)) {
      this.state.conversations.forEach((item) => {
        Message.getLastBy(item.id).then((result) => {
          const lastMessages = this.state.lastMessages;
          lastMessages[item.id] = result.message;
          this.setState({ lastMessages });
        });
      });
    }
  }

  genRows() {
    const { conversations } = this.state;
    return conversations;
  }

  openConversation(conversation) {
    const { navigation } = this.props;
    navigation.navigate('ConversationScreen', { conversation });
  }

  isUser() {
    const { currentUser } = this.props;
    return typeof currentUser.password === 'undefined';
  }

  renderItem(item) {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.openConversation(item)}>
        <View style={styles.item}>
          <View style={styles.avatar}>
            <Text>{this.getAvatarName(item)}</Text>
          </View>
          <View style={styles.info}>
            <View style={styles.infoContent}><Text style={{ fontSize: 18 }}>{this.getDisplayName(item)}</Text></View>
            <View style={styles.infoContent}><Text>{this.state.lastMessages[item.id]}</Text></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderConversations() {
    return (
      <ListView
        ref={(component) => {
          this.listView = component;
        }}
        dataSource={ConversationListScreen.getDataSource().cloneWithRows(this.genRows())}
        renderRow={this.renderItem}
        enableEmptySections
      />
    );
  }

  render() {
    const { currentUser } = this.props;
    return (
      <View style={styles.container}>
        {!isEmpty(currentUser) && this.renderConversations()}
        {this.state.isLoading && <ActivityIndicator size="large" style={styles.loading} animating={this.state.isLoading} />}
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
  navigation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  currentUser: store[authDucks.NAME].currentUser,
});

export default connect(mapStateToProps)(ConversationListScreen);
