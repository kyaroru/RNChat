// @flow
export const NAME = 'HOME';

export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';

export const updateCurrentUser = user => ({
  type: UPDATE_CURRENT_USER,
  user,
});

export const getCurrentUser = state => state[NAME].currentUser;
