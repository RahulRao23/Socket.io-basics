const mongoose = require('mongoose');
const userServices = require('../services/users.services');
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

	/* Add user to room */
	socket.on(CONSTANTS.ROOM.ADD_TO_ROOM, async userData => {
		userData = typeof userData == 'string' ? JSON.parse(userData) : userData;
		console.log({ userData });

		const friendDetails = await userServices.getUserDetails({
			_id: userData.user_id,
		});

		/* Check if friend exists */
		if (!friendDetails) {
			socket.emit(CONSTANTS.EVENT_NAMES.DOES_NOT_EXIST, 'User does not exist');
		} else {
			/* If friend exists and socket is connected */
			if (friendDetails && friendDetails.socket_id) {
				/* Add friend to room */
				const friendSocketId = userData.friend_socket_id;
				const roomId = 'room:' + userData.room_id;
				console.log({ friendSocketId, roomId });

				const friendSocket = io.sockets.sockets.get(friendSocketId);

				if (friendSocket) {
					friendSocket.join(roomId);
					friendSocket.emit(
						CONSTANTS.EVENT_NAMES.NOTIFICATION,
						`You have been added to: ${roomId}`
					);
				} else {
					io
						.to(socket.id)
						.emit(
							CONSTANTS.EVENT_NAMES.INVALID_SOCKET,
							'Socket id does not exist.'
						);
				}

				/* Add friend to group in DB */
			} else {
				/* If no socket id then add friend to pending list */
				await PendingUserModel.insert({
					user_id: userData.friend_user_id,
					room_id: userData.room_id,
				});
			}

			/* Notify all group members */
			io
				.to(roomId)
				.emit(
					CONSTANTS.ROOM.USER_ADDED,
					`${userData.name} added ${friendDetails.name} to the group.`
				);
		}

		// NOT IN USE
		// /* Add friend to room */
		// const friendSocketId = userData.friend_socket_id;
		// const roomId = 'room:'+userData.room_id;
		// console.log({friendSocketId, roomId});

		// const friendSocket = io.sockets.sockets.get(friendSocketId);

		// if(friendSocket) {
		// 	console.log(friendSocket.id);
		// 	friendSocket.join(roomId);
		// 	friendSocket.emit('notification', `You have been added to: ${roomId}`);
		// } else {
		// 	io.to(socket.id).emit('user:invalid-socket', "Socket id does not exist.");
		// }

		// /* Added friend to group in DB */

		// socket.to('room:'+userData.room_id).emit(CONSTANTS.ROOM.USER_ADDED, `Sok: ${socket.id} added to room:${userData.room_id}`);
	});

	socket.on('rooms', () => {
		const roomIds = io.of('/').adapter.rooms;
		const sids = io.of('/').adapter.sids;
		console.log({ roomIds, sids });
		socket.emit('rooms', { roomIds, sids });
	});
};

module.exports = socketHandler;
