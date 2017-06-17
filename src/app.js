import { StackNavigator as stackNavigator } from 'react-navigation';
import Drawer from './components/drawer';

const App = stackNavigator({
  Drawer: { screen: Drawer },
});

export default App;

// const stack = {
//   HomeScreen: { screen: HomeScreen },
//   UserScreen: { screen: UserScreen },
//   CustomerServiceScreen: { screen: CustomerServiceScreen },
// };
//
// const Drawer = DrawerNavigator({
//   HomeView: {
//     name: 'HomeView',
//     screen: StackNavigator(stack, { initialRouteName: 'HomeScreen' }),
//   },
//   UserView: {
//     name: 'UserView',
//     screen: StackNavigator(stack, { initialRouteName: 'UserScreen' }),
//   },
//   CustomerServiceView: {
//     name: 'CustomerServiceView',
//     screen: StackNavigator(stack, { initialRouteName: 'CustomerServiceScreen' }),
//   },
// }, getDrawerConfig(300, 'left'));
//
// const App = StackNavigator({
//   Drawer: { screen: Drawer },
//   ...stack,
// }, {
//   headerMode: 'none',
// });
