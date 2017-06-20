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
import { Message } from '../../database';
import { getNavigationOptions } from '../../utils/navigation';
import { getFormattedTime } from '../../utils/dateFormat';
import * as Colors from '../../themes/colors';
import * as homeDucks from '../home/ducks';

class ConversationScreen extends Component {
  static navigationOptions = ({ navigation }) => getNavigationOptions(navigation.state.params.conversation.csName, Colors.primary, 'white');
  static getDataSource() {
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  constructor() {
    super();
    this.onNewMessage = this.onNewMessage.bind(this);
    this.state = {
      isLoading: true,
      message: null,
      messages: [],
    };
  }

  componentDidMount() {
    const { navigation: { state } } = this.props;
    const conversation = state.params.conversation;
    this.getAllExistingMessages();
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
  }

  getAllExistingMessages() {
    const { navigation: { state } } = this.props;
    const conversation = state.params.conversation;
    Message.getMoreBy(conversation.id).then((messages) => {
      this.setState({ messages, isLoading: false });
    });
  }

  genRows() {
    const { messages } = this.state;
    return messages;
  }

  clearInput() {
    this.messageInput.setNativeProps({ text: '' });
  }

  sendMessage() {
    const { navigation: { state } } = this.props;
    const conversation = state.params.conversation;
    const message = {
      conversationId: conversation.id,
      userId_csId_converId: `${conversation.userId_csId}_${conversation.id}`,
      from: conversation.userId,
      fromName: conversation.userName,
      createdAt: new Date().getTime(),
      message: this.state.message,
    };
    Message.add(conversation.id, message);
    this.clearInput();
  }

  renderItem(item) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.item}>
          <View style={styles.avatar}>
            <Text>{item.fromName}</Text>
          </View>
          <View style={styles.info}>
            <View style={styles.infoContent}><Text>{item.fromName} ({getFormattedTime(item.createdAt)})</Text></View>
            <View style={styles.infoContent}><Text style={{ fontSize: 18 }}>{item.message}</Text></View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={ConversationScreen.getDataSource().cloneWithRows(this.genRows())}
          renderRow={this.renderItem}
          enableEmptySections
        />
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
};

const mapStateToProps = store => ({
  currentUser: store[homeDucks.NAME].currentUser,
});

export default connect(mapStateToProps)(ConversationScreen);
