import { combineReducers } from 'redux';
import * as ducks from './ducks';

const currentUser = (state = {}, action) => {
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
