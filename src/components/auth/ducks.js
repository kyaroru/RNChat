// @flow
export const NAME = 'AUTH';

export const UPDATE_CURRENT_USER = `${NAME}/UPDATE_CURRENT_USER`;

export const updateCurrentUser = user => ({
  type: UPDATE_CURRENT_USER,
  user,
});

export const getCurrentUser = store => store[NAME].currentUser;
