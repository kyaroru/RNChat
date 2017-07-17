// @flow
export const NAME = 'AUTH';

export const UPDATE_CURRENT_USER = `${NAME}/UPDATE_CURRENT_USER`;
export const UPDATE_CURRENT_DEVICE = `${NAME}/UPDATE_CURRENT_DEVICE`;

export const updateCurrentUser = user => ({
  type: UPDATE_CURRENT_USER,
  user,
});

export const updateCurrentDevice = device => ({
  type: UPDATE_CURRENT_DEVICE,
  device,
});

export const getCurrentUser = store => store[NAME].currentUser;
export const getCurrentDevice = store => store[NAME].currentDevice;
