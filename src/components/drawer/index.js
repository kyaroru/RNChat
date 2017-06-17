import { DrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { getNavigationOptionsWithAction, getDrawerNavigationOptions, getDrawerConfig } from '../../utils/navigation';
import NavBarItem from '../common/NavBarItem';
import HomeScreen from '../home/HomeScreen';
import UserScreen from '../user/UserScreen';
import CustomerServiceScreen from '../customer-service/CustomerServiceScreen';
import * as Colors from '../../themes/colors';

const drawerItem = navigation => <NavBarItem iconName="bars" onPress={() => navigation.navigate('DrawerOpen')} />;

const getDrawerIcon = (iconName, tintColor) => <Icon name={iconName} size={20} color={tintColor} />;

const homeDrawerIcon = ({ tintColor }) => getDrawerIcon('home', tintColor);
const userDrawerIcon = ({ tintColor }) => getDrawerIcon('user', tintColor);
const csDrawerIcon = ({ tintColor }) => getDrawerIcon('user-md', tintColor);

const homeNavOptions = getDrawerNavigationOptions('Home', Colors.primary, 'white', homeDrawerIcon);
const userNavOptions = getDrawerNavigationOptions('Users', Colors.primary, 'white', userDrawerIcon);
const csNavOptions = getDrawerNavigationOptions('Customer Service', Colors.primary, 'white', csDrawerIcon);

const Drawer = DrawerNavigator({
  HomeScreen: { screen: HomeScreen, navigationOptions: homeNavOptions },
  UserScreen: { screen: UserScreen, navigationOptions: userNavOptions },
  CustomerServiceScreen: { screen: CustomerServiceScreen, navigationOptions: csNavOptions },
}, getDrawerConfig(300, 'left'));

Drawer.navigationOptions = ({ navigation }) => getNavigationOptionsWithAction('RNChat', Colors.primary, 'white', drawerItem(navigation));

export default Drawer;
