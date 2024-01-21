const constants = {};

constants.USER_STATUS = {
	ACTIVE: 1,
	DELETED: 2,
	LOGGED_OUT: 3,
};

constants.FRIEND_REQUEST_STATUS = {
	SENT: 1,
	ACCEPTED: 3,
	DECLINED: 4,
};

constants.EVENT_NAMES = {
	DOES_NOT_EXIST: 'does-not-exist',
	NOTIFY_USER: 'notify-user',
	ROOM_ADD: 'room-add',
	INVALID_SOCKET: 'invalid-socket',
	FRIEND_REQUEST_SENT: 'friend-request-sent',
	FRIEND_REQUEST_RECEIVED: 'friend-request-received',
	FRIEND_ADDED: 'friend-added',
	FRIEND_REQUEST_DECLINE: 'friend-request-decline',
	NEW_MESSAGE: 'new-message',
	DISCONNECTING: 'disconnecting',
	DISCONNECT: 'disconnect',
	DISCONNECT_RESPONSE: 'disconnect-response',
};

constants.ROOM = {
	ADD_TO_ROOM: 'add-to-room',
	USER_ADDED: 'user-added',
};

constants.USER_ROLES = {
	GROUP_ADMIN: 1,
	PARTICIPANT: 2
};

constants.NOTIFICATION_TYPES = {
	ROOM_ADD: 1,
	FRIEND_REQUEST: 2,
	NEW_MESSAGE: 3,
	FRIEND_REQUEST_RESPONSE: 4,
};

constants.CHAT_GROUP_TYPES = {
	GROUP: 1,
	PERSONAL: 2,
};

constants.SALT_ROUNDS = 10;

constants.JWT_PRIVATE_KEY = '<PRIVATE-KEY>';
constants.ROOM_PREFIX = 'Room:';

module.exports = constants;
