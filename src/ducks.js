import { combineReducers } from 'redux';
import auth from './components/auth';
import conversation from './components/conversation';

const createReducers = (reducers = {}) => combineReducers({
  [auth.ducks.NAME]: auth.reducer,
  [conversation.ducks.NAME]: conversation.reducer,
  ...reducers,
});

export default createReducers;
