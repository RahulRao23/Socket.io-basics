const constants = {};

constants.USER_STATUS = {
	ACTIVE: 1,
	DELETED: 2,
};

constants.FRIEND_REQUEST_STATUS = {
	SENT: 1,
	RECEIVED_BY_FRIEND: 2,
	ACCEPTED: 3,
	DECLINED: 4,
};

constants.EVENT_NAMES = {
	DOES_NOT_EXIST: 'does_not_exist',
	NOTIFY_USER: 'notify_user',
	ROOM_ADD: 'room_add',
	INVALID_SOCKET: 'invalid-socket',
	FRIEND_REQUEST_SENT: 'friend-request-sent',
	FRIEND_REQUEST_RECEIVED: 'friend-request-received',
	FRIEND_ADDED: 'friend-added',
};

constants.ROOM = {
	ADD_TO_ROOM: 'add_to_room',
	USER_ADDED: 'user_added',
};

constants.USER_ROLES = {
	GROUP_ADMIN: 1,
	PARTICIPANT: 2
};

constants.NOTIFICATION_TYPES = {
	ROOM_ADD: 1,
	FRIEND_REQUEST: 2,
};

constants.SALT_ROUNDS = 10;

constants.JWT_PRIVATE_KEY = '<PRIVATE-KEY>';

module.exports = constants;
