import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class RightItem extends Component {
  constructor() {
    super();
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { action, screenName, onPress, navigation } = this.props;
    if (action === 'navigate') {
      navigation.navigate(screenName);
    } else {
      onPress();
    }
  }

  render() {
    const { iconName } = this.props;
    return (
      <TouchableOpacity
        style={{ paddingRight: 20 }}
        onPress={() => this.onPress()}
      >
        <Icon name={iconName} size={20} color="#fff" />
      </TouchableOpacity>

    );
  }
}

export default RightItem;
