import * as userOperation from './User';
import * as csOperation from './CustomerService';
import * as conversationOperation from './Conversation';

export const User = {
  ...userOperation,
};

export const CustomerService = {
  ...csOperation,
};

export const Conversation = {
  ...conversationOperation,
};
