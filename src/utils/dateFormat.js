import moment from 'moment';

export const getFormattedTime = (timestamp) => {
  const timeFormat = 'hh:mm a';
  return moment(timestamp).format(timeFormat);
}
