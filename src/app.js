import { StackNavigator as stackNavigator } from 'react-navigation';
import HomeScreen from './components/home/HomeScreen';
import UserScreen from './components/user/UserScreen';
import CustomerServiceScreen from './components/customer-service/CustomerServiceScreen';

const App = stackNavigator({
  HomeScreen: { screen: HomeScreen },
  UserScreen: { screen: UserScreen },
  CustomerServiceScreen: { screen: CustomerServiceScreen },
});

export default App;
