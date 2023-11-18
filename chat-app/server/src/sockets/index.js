const mongoose = require('mongoose');
const userServices = require('../services/users.services');
const notificationServices = require('../services/notifications.services');
const CONSTANTS = require('../utilities/constants');

const validateMaxUserPerRoom = async () => {
	/* Validation to be implemented */
	return { valid: true, count: 5 };
};
const socketHandler = (io, socket) => {
	/* Validate user on socket connection */

	socket.use(async ([event, ...args], next) => {
		/* VALIDATION PENDING */

		// console.log({event, args});
		if (event === CONSTANTS.ROOM.ADD_TO_ROOM) {
			const { valid, count: usersInRoom } = await validateMaxUserPerRoom();
			if (!valid) {
				/* to be handled in front-end with 'connect-error' event */
				next(new Error('max users in group!'));
			}
		}

		next();
	});

	/** Add user to room 
	 * params: { friend_id, room_id }
	*/
	socket.on(CONSTANTS.ROOM.ADD_TO_ROOM, async data => {
		data = typeof data == 'string' ? JSON.parse(data) : data;
		const userData = socket.userData;
		console.log({ data });

		const friendDetails = await userServices.getUserDetails({
			_id: data.friend_id,
		});

		/* Check if friend exists */
		if (!friendDetails) {
			const errorData = { errName: 'UNAUTHORIZED', message: "Friend does not exist" };
			socket.emit(CONSTANTS.EVENT_NAMES.DOES_NOT_EXIST, errorData);
			return;
		}

		const notificationData = {
			from: userData._id,
			to: friendDetails._id,
			type: CONSTANTS.NOTIFICATION_TYPES.ROOM_ADD,
		};
		/* If friend exists and socket is connected */
		if (friendDetails.socket_id) {
			/* Add friend to room */
			const roomId = 'room:' + data.room_id;
			console.log({ roomId });

			const friendSocket = io.sockets.sockets.get(friendDetails.socket_id);
			if (friendSocket) {
				friendSocket.join(roomId);
				friendSocket.emit(
					CONSTANTS.EVENT_NAMES.ROOM_ADD,
					{
						room_id: roomId,
						/* TODO: Send room members data */
					}
				);
			}
			notificationData.status = CONSTANTS.FRIEND_REQUEST_STATUS.RECEIVED_BY_FRIEND;
		}

		await notificationServices.createNotification(notificationData);

		/* TODO: Add friend to group in DB */

		/* Notify all group members */
		io
			.to(roomId)
			.emit(
				CONSTANTS.ROOM.USER_ADDED,
				`${userData.name} added ${friendDetails.name} to the group.`
			);

		/* TODO: Handling inactive group members notification */
		
		return;

	});

	socket.on('rooms', () => {
		const roomIds = io.of('/').adapter.rooms;
		const sids = io.of('/').adapter.sids;
		console.log({ roomIds, sids });
		socket.emit('rooms', { roomIds, sids });
	});
};

module.exports = socketHandler;
