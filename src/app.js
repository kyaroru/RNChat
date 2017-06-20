import { StackNavigator } from 'react-navigation';
import Drawer from './components/drawer';
import ConversationScreen from './components/conversation/ConversationScreen';

const App = StackNavigator({
  Drawer: { screen: Drawer },
  ConversationScreen: { screen: ConversationScreen },
});

export default App;
