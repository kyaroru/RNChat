// @flow
export const NAME = 'CONVERSATION';

export const UPDATE_TARGET_USER = `${NAME}/UPDATE_TARGET_USER`;

export const updateTargetUser = user => ({
  type: UPDATE_TARGET_USER,
  user,
});

export const getTargetUser = store => store[NAME].targetUser;
