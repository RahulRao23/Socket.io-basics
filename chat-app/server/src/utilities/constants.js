const constants = {};

constants.USER_STATUS = {
  ACTIVE: 1,
  DELETED: 2,
};

constants.EVENT_NAMES = {
  DOES_NOT_EXIST: 'does_not_exist',
  NOTIFY_USER: 'notify_user',
  NOTIFICATION: 'notification',
  INVALID_SOCKET: 'invalid-socket',
};

constants.ROOM = {
  ADD_TO_ROOM: 'add_to_room',
  USER_ADDED: 'user_added',
};

constants.SALT_ROUNDS = 10;

constants.JWT_PRIVATE_KEY = '<PRIVATE-KEY>';

module.exports = constants;
