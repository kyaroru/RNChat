import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getNavigationOptions } from '../../utils/navigation';
import { Conversation } from '../../database';
import isEmpty from 'lodash/isEmpty';
import * as homeDucks from '../home/ducks';

class ConversationListScreen extends Component {
  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      conversations: null,
      refreshing: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getAllConversation();
  }

  onRefresh() {
    const { currentUser } = this.props;
    this.setState({ refreshing: true });
    Conversation.getMoreBy('userId', currentUser.id).then((conversations) => {
      this.setState({ conversations, refreshing: false });
    });
  }

  getAllConversation() {
    const { currentUser } = this.props;
    if (!isEmpty(currentUser)) {
      Conversation.getMoreBy('userId', currentUser.id).then((conversations) => {
        this.setState({ conversations });
        this.setState({ isLoading: false });
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  keyExtractor = item => item.id;
  itemSeparator = ({ highlighted }) => (
    <View style={[styles.separator, highlighted && { marginLeft: 0 }]} />
  )

  openConversation(conversation) {
    const { navigation } = this.props;
    navigation.navigate('ConversationScreen', { conversation });
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.openConversation(item)}>
        <View style={styles.item}>
          <View style={styles.avatar}>
            <Text>{item.csName[0]}</Text>
          </View>
          <View style={styles.info}>
            <View style={styles.infoContent}><Text style={{ fontSize: 18 }}>{item.csName}</Text></View>
            <View style={styles.infoContent}><Text>{item.csId}</Text></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderLoginMessage() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20 }}>Please login to continue :p</Text>
      </View>
    )
  }

  renderConversations() {
    return (
      <FlatList
        ItemSeparatorComponent={this.itemSeparator}
        data={this.state.conversations}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        onRefresh={this.onRefresh}
        refreshing={this.state.refreshing}
      />
    );
  }

  render() {
    const { currentUser } = this.props;
    return (
      <View style={styles.container}>
        {isEmpty(currentUser) && this.renderLoginMessage()}
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

const mapStateToProps = store => ({
  currentUser: store[homeDucks.NAME].currentUser,
});

export default connect(mapStateToProps)(ConversationListScreen);
