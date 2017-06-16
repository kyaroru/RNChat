import { combineReducers } from 'redux';
import home from './components/home';

const createReducers = (reducers = {}) => combineReducers({
  [home.ducks.NAME]: home.reducer,
  ...reducers,
});

export default createReducers;
