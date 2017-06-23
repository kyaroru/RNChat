import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Message } from '../../database';
import { getNavigationOptions } from '../../utils/navigation';
import { getFormattedTime } from '../../utils/dateFormat';
import * as Colors from '../../themes/colors';
import * as authDucks from '../auth/ducks';
import { getStore } from '../../createStore';
import * as ducks from './ducks';

class ConversationScreen extends Component {
  static navigationOptions = () => {
    const store = getStore();
    const state = store.getState();
    const targetUser = ducks.getTargetUser(state);
    return getNavigationOptions(`${targetUser.name}`, Colors.primary, 'white');
  };
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
    this.onNewMessage = this.onNewMessage.bind(this);
    this.getAllExistingMessages = this.getAllExistingMessages.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onFooterLayout = this.onFooterLayout.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.getAvatarName = this.getAvatarName.bind(this);
    this.getSenderName = this.getSenderName.bind(this);
    this.state = {
      isLoading: true,
      message: null,
      messages: [],
      listHeight: 0,
      footerY: 0,
    };
  }

  componentDidMount() {
    const { navigation: { state } } = this.props;
    const conversation = state.params.conversation;
    Message.getMoreBy(conversation.id).then((result) => {
      if (result.length === 0) {
        this.setState({ isLoading: false });
      }
    });
    Message.onNew('conversationId', conversation.id, this.onNewMessage);
  }

  componentWillUnmount() {
    const { navigation: { state } } = this.props;
    const conversation = state.params.conversation;
    Message.offNew('conversationId', conversation.id);
  }

  onNewMessage(snapshot) {
    const value = snapshot.val();
    const key = snapshot.key;
    const message = {
      id: key,
      ...value,
    };
    const newMessages = this.state.messages;
    newMessages.push(message);
    this.setState({ messages: newMessages });
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  onLayout(event) {
    const layout = event.nativeEvent.layout;
    this.setState({ listHeight: layout.height });
  }

  // When the fake footer is laid out, store the y-position
  onFooterLayout(event) {
    const layout = event.nativeEvent.layout;
    this.setState({ footerY: layout.y });
  }

  getAllExistingMessages() {
    const { navigation: { state } } = this.props;
    const conversation = state.params.conversation;
    Message.getMoreBy(conversation.id).then((messages) => {
      this.setState({ messages, isLoading: false });
    });
  }

  getAvatarName(item) {
    const { currentUser, targetUser } = this.props;
    if (item.from === targetUser.id) {
      return ConversationScreen.splitName(targetUser.name);
    }
    return ConversationScreen.splitName(currentUser.name);
  }

  getSenderName(item) {
    const { currentUser, targetUser } = this.props;
    if (item.from === targetUser.id) {
      return targetUser.name;
    }
    return currentUser.name;
  }

  clearInput() {
    this.messageInput.setNativeProps({ text: '' });
  }

  isUser() {
    const { currentUser } = this.props;
    return typeof currentUser.password === 'undefined';
  }

  sendMessage() {
    const { navigation: { state }, currentUser } = this.props;
    const conversation = state.params.conversation;
    const message = {
      conversationId: conversation.id,
      userId_csId_converId: `${conversation.userId_csId}_${conversation.id}`,
      from: currentUser.id,
      createdAt: new Date().getTime(),
      message: this.state.message,
    };

    Message.add(conversation.id, message);
    this.clearInput();
  }

  scrollToBottom(animated = true) {
    if (this.state.listHeight && this.state.footerY && this.state.footerY > this.state.listHeight) {
      // Calculates the y scroll position inside the ListView
      const scrollTo = this.state.footerY - this.state.listHeight;

      // Scroll that sucker!
      this.listView.scrollTo({
        y: scrollTo,
        animated,
      });
    }
  }

  // Render a fake footer
  renderFooter() {
    return (
      <View onLayout={this.onFooterLayout} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text />
      </View>
    );
  }

  renderItem(item) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.item}>
          <View style={styles.avatar}>
            <Text>{this.getAvatarName(item)}</Text>
          </View>
          <View style={styles.info}>
            <View style={styles.infoContent}><Text>{this.getSenderName(item)} ({getFormattedTime(item.createdAt)})</Text></View>
            <View style={styles.infoContent}><Text style={{ fontSize: 18 }}>{item.message}</Text></View>
          </View>
        </View>
      </View>
    );
  }

  renderMessages() {
    const { messages } = this.state;
    if (messages.length <= 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ padding: 10 }}>
            <Icon name={this.isUser() ? 'question-circle-o' : 'info-circle'} size={50} color={Colors.primary} />
          </View>
          <Text style={{ color: Colors.primary }}>{this.isUser() ? 'Hmmm.. start asking question :p' : 'Hmm.. start answering customer enquiry :p'}</Text>
        </View>
      );
    }
    return (
      <ListView
        ref={(component) => {
          this.listView = component;
        }}
        dataSource={ConversationScreen.getDataSource().cloneWithRows(messages)}
        renderRow={this.renderItem}
        enableEmptySections
        renderFooter={this.renderFooter}
        onLayout={this.onLayout}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {this.renderMessages()}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={[styles.input, { borderColor: Colors.primary }]}
            ref={(component) => {
              this.messageInput = component;
            }}
            placeholder="Enter messages..."
            underlineColorAndroid="transparent"
            onChangeText={message => this.setState({ message })}
          />
          <TouchableOpacity style={styles.btnSend} onPress={() => this.sendMessage()}>
            <Text style={{ color: 'white' }}>Send</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'ios' && <KeyboardSpacer />}
        {this.state.messages.length <= 0 && this.state.isLoading && <ActivityIndicator size="large" style={styles.loading} animating={this.state.isLoading} />}
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
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    flex: 8,
    margin: 10,
  },
  btnSend: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    flex: 2,
    margin: 10,
  },
});

ConversationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  targetUser: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  currentUser: store[authDucks.NAME].currentUser,
  targetUser: store[ducks.NAME].targetUser,
});

export default connect(mapStateToProps)(ConversationScreen);
