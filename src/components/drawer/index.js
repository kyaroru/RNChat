import { DrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { getNavigationOptionsWithAction, getDrawerNavigationOptions, getDrawerConfig } from '../../utils/navigation';
import NavBarItem from '../common/NavBarItem';
import HomeScreen from '../home/HomeScreen';
import UserScreen from '../user/UserScreen';
import CustomerServiceScreen from '../customer-service/CustomerServiceScreen';
import ConversationListScreen from '../conversation/ConversationListScreen';
import * as Colors from '../../themes/colors';

const getDrawerItem = navigation => (
  <NavBarItem
    iconName="bars"
    onPress={() => {
      if (navigation.state.index === 0) {
        // check if drawer is not open, then only open it
        navigation.navigate('DrawerOpen');
      } else {
        // else close the drawer
        navigation.navigate('DrawerClose');
      }
    }}
  />
);

const getDrawerIcon = (iconName, tintColor) => <Icon name={iconName} size={20} color={tintColor} />;

const homeDrawerIcon = ({ tintColor }) => getDrawerIcon('home', tintColor);
const userDrawerIcon = ({ tintColor }) => getDrawerIcon('user', tintColor);
const csDrawerIcon = ({ tintColor }) => getDrawerIcon('user-md', tintColor);
const conDrawerIcon = ({ tintColor }) => getDrawerIcon('comments', tintColor);

const homeNavOptions = getDrawerNavigationOptions('Home', Colors.primary, 'white', homeDrawerIcon);
const userNavOptions = getDrawerNavigationOptions('Users', Colors.primary, 'white', userDrawerIcon);
const csNavOptions = getDrawerNavigationOptions('Customer Service', Colors.primary, 'white', csDrawerIcon);
const conNavOptions = getDrawerNavigationOptions('Conversation List', Colors.primary, 'white', conDrawerIcon);

const Drawer = DrawerNavigator({
  HomeScreen: { screen: HomeScreen, navigationOptions: homeNavOptions },
  UserScreen: { screen: UserScreen, navigationOptions: userNavOptions },
  CustomerServiceScreen: { screen: CustomerServiceScreen, navigationOptions: csNavOptions },
  ConversationListScreen: { screen: ConversationListScreen, navigationOptions: conNavOptions },
}, getDrawerConfig(300, 'left', 'HomeScreen'));

Drawer.navigationOptions = ({ navigation }) => getNavigationOptionsWithAction('RNChat', Colors.primary, 'white', getDrawerItem(navigation));

export default Drawer;
