import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getNavigationOptions } from '../../themes/appTheme';
import NavBarItem from '../common/NavBarItem';
import { User, CustomerService } from '../../database';
import { alert } from '../../utils/alert';
import * as ducks from './ducks';
import * as Colors from '../../themes/colors';

const navOptions = getNavigationOptions('RNChat', Colors.primary, 'white');

const leftItem = navigation => (
  <NavBarItem iconName="users" onPress={() => navigation.navigate('UserScreen')} />
);

const rightItem = navigation => (
  <NavBarItem iconName="user-md" onPress={() => navigation.navigate('CustomerServiceScreen')} />
);

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    ...navOptions,
    headerLeft: leftItem(navigation),
    headerRight: rightItem(navigation),
  });

  constructor() {
    super();
    this.state = {
      selectedTab: 'customer',
      email: null,
      name: null,
      isNameFocus: false,
      isEmailFocus: false,
      isLoading: false,
    };
  }

  clearInput = () => {
    this.nameInput.setNativeProps({ text: '' });
    this.emailInput.setNativeProps({ text: '' });
  }

  addUser(user) {
    const { updateCurrentUser } = this.props;
    this.setState({ isLoading: true });
    User.add(user).then(() => {
      alert('Success', 'You have been registered as User!', 'OK');
      this.setState({ email: null, name: null, isLoading: false });
      this.clearInput();
      updateCurrentUser(user);
    });
  }

  addCustomerService(customerService) {
    const { updateCurrentUser } = this.props;
    this.setState({ isLoading: true });
    CustomerService.add(customerService).then(() => {
      alert('Success', 'You have been registered as Customer Service Officer!', 'OK');
      this.setState({ email: null, name: null, isLoading: false });
      this.clearInput();
      updateCurrentUser(customerService);
    });
  }

  startChat() {
    if (this.state.selectedTab === 'customer') {
      const user = {
        name: this.state.name,
        email: this.state.email,
      };
      this.addUser(user);
    } else {
      const customerService = {
        name: this.state.name,
        email: this.state.email,
        password: '1234',
        active: 'false',
      };
      this.addCustomerService(customerService);
    }
  }

  renderInput() {
    const { isNameFocus, isEmailFocus } = this.state;
    return (
      <View>
        <TextInput
          style={[styles.input, { borderColor: isNameFocus ? 'green' : Colors.primary }]}
          ref={(component) => {
            this.nameInput = component;
          }}
          placeholder="Enter your name"
          underlineColorAndroid="transparent"
          onFocus={() => this.setState({ isNameFocus: true })}
          onBlur={() => this.setState({ isNameFocus: false })}
          onChangeText={name => this.setState({ name })}
        />
        <View style={{ height: 10 }} />
        <TextInput
          style={[styles.input, { borderColor: isEmailFocus ? 'green' : Colors.primary }]}
          ref={(component) => {
            this.emailInput = component;
          }}
          placeholder="Enter your email"
          underlineColorAndroid="transparent"
          onFocus={() => this.setState({ isEmailFocus: true })}
          onBlur={() => this.setState({ isEmailFocus: false })}
          onChangeText={email => this.setState({ email })}
        />
        <View style={{ height: 10 }} />
        <View style={[styles.input, { borderColor: Colors.primary }]}>
          <TouchableOpacity style={styles.btnSubmit} onPress={() => this.startChat()}>
            <Text style={{ textAlign: 'center', color: Colors.primary, marginRight: 10 }}>Start Chat!</Text>
            {this.state.isLoading && <ActivityIndicator animating={this.state.isLoading} />}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.instructions}>
            Welcome to RNChat. Please input your name & email to get started :p
          </Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => this.setState({ selectedTab: 'customer' })} style={styles.tab}>
              <Icon name="user" size={50} color={this.state.selectedTab === 'customer' ? Colors.primary : '#ddd'} />
              <Text>User</Text>
            </TouchableOpacity>
            <View style={styles.tabSeparator} />
            <TouchableOpacity onPress={() => this.setState({ selectedTab: 'customerService' })} style={styles.tab}>
              <Icon name="user-md" size={50} color={this.state.selectedTab === 'customerService' ? Colors.primary : '#ddd'} />
              <Text>Customer Service</Text>
            </TouchableOpacity>
          </View>
          {this.renderInput()}
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
  updateCurrentUser: PropTypes.func,
};

const mapDispatchToProps = {
  updateCurrentUser: ducks.updateCurrentUser,
};

export default connect(null, mapDispatchToProps)(HomeScreen);
