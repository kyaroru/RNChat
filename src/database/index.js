import * as user from './user';
import * as customerService from './customerService';
import * as conversation from './conversation';
import * as message from './message';
import * as device from './device';

export const User = {
  ...user,
};

export const CustomerService = {
  ...customerService,
};

export const Conversation = {
  ...conversation,
};

export const Message = {
  ...message,
};

export const Device = {
  ...device,
};
