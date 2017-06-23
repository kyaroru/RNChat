import { combineReducers } from 'redux';
import * as ducks from './ducks';

const targetUser = (state = {}, action) => {
  switch (action.type) {
    case ducks.UPDATE_TARGET_USER:
      return action.user;
    default:
      return state;
  }
};

export default combineReducers({
  targetUser,
});
