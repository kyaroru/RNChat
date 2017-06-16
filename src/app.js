import { StackNavigator as stackNavigator } from 'react-navigation';
import HomeScreen from './components/home/HomeScreen';
import UserScreen from './components/user/UserScreen';
// import RightItem from './components/common/RightItem';

const App = stackNavigator({
  HomeScreen: { screen: HomeScreen },
  UserScreen: { screen: UserScreen },
});

export default App;
