import { combineReducers } from 'redux';
import auth from './components/auth';

const createReducers = (reducers = {}) => combineReducers({
  [auth.ducks.NAME]: auth.reducer,
  ...reducers,
});

export default createReducers;
