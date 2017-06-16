import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { getNavigationOptions } from '../../themes/appTheme';
import { User } from '../../database';
import RightItem from '../common/RightItem';

const navOptions = getNavigationOptions('Home', '#3498db', 'white');

const rightItem = (navigation) => (
  <RightItem navigation={navigation} action="navigate" screenName="UserScreen" iconName="user" />
);

class HomeScreen extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    ...navOptions,
    headerRight:  rightItem(navigation),
  });

  startChat() {
    console.log('start chatting');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Start Chatting!" onPress={() => this.startChat()} />
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
});

export default HomeScreen;
