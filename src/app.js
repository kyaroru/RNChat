import { StackNavigator } from 'react-navigation';
import Drawer from './components/drawer';

const App = StackNavigator({
  Drawer: { screen: Drawer },
});

export default App;
