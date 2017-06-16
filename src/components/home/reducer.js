import * as ducks from './ducks';
import { combineReducers } from 'redux';

const currentUser = (state = null, action) => {
  switch (action.type) {
    case ducks.UPDATE_CURRENT_USER:
      return action.user;
    default:
      return state;
  }
};

export default combineReducers({
  currentUser,
});
