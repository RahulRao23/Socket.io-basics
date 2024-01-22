const mongoose = require('mongoose');
const userServices = require('../services/users.services');
const notificationServices = require('../services/notifications.services');
const conversationService = require('../services/conversation.services');
const chatServices = require('../services/chatGroup.services');

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

		const groupDetails = await chatServices.getChatGroupDetail({ _id: data.room_id });
		if (!groupDetails) {
			const errorData = { errName: 'UNAUTHORIZED', message: "Group does not exist" };
			io.to(userData.socket_id).emit(CONSTANTS.EVENT_NAMES.DOES_NOT_EXIST, errorData);
			return;
		}
		groupDetails.total_members += 1;
		if (friendDetails.status === CONSTANTS.USER_STATUS.ACTIVE) groupDetails.active_members += 1;

		groupDetails.participants.push(friendDetails._id);
		await groupDetails.save();

		friendDetails.chat_groups.push(groupDetails._id);
		await friendDetails.save();

		if (groupDetails.total_members > groupDetails.active_members) {
			const inactiveUsers = await userServices.getInactiveChatGroupMembers(groupDetails._id);
			console.log({inactiveUsers});
			const newNotifications = [];

			for (const { _id } of inactiveUsers) {
				newNotifications.push({
					from: userData._id,
					to: _id,
					type: CONSTANTS.NOTIFICATION_TYPES.ROOM_ADD,
					data: {
						_id: friendDetails._id,
						name: friendDetails.name,
					}
				});
			}
			await notificationServices.createMultipleNotifications(newNotifications);
		}

		const roomId = CONSTANTS.ROOM_PREFIX + data.room_id;
		console.log({ roomId });

		/* If friend exists and socket is connected */
		if (friendDetails.socket_id) {
			/* Add friend to room */
			const friendSocket = io.sockets.sockets.get(friendDetails.socket_id);
			if (friendSocket) {
				friendSocket.join(roomId);
			}
		}

		/* Notify all group members */
		return io
			.to(roomId)
			.emit(
				CONSTANTS.ROOM.USER_ADDED,
				{
					new_user_id: friendDetails._id,
					new_user_name: friendDetails.name,
					message: `${userData.name} added ${friendDetails.name} to the group.`,
				}
			);
	});

	socket.on(CONSTANTS.EVENT_NAMES.NEW_MESSAGE, async data => {
		data = typeof data == 'string' ? JSON.parse(data) : data;
		const userData = socket.userData;
		console.log({ data });

		const newMessage = await conversationService.createConversation({
			sender: userData._id,
			room_id: data.room_id,
			text: data.text,
		});

		/* Create notification to all users only if all users are not connected */
		const groupDetails = await chatServices.getChatGroupDetail({ _id: data.room_id });
		if (!groupDetails) {
			const errorData = { errName: 'UNAUTHORIZED', message: "Group does not exist" };
			io.to(userData.socket_id).emit(CONSTANTS.EVENT_NAMES.DOES_NOT_EXIST, errorData);
			return;
		}
		if (groupDetails.total_members > groupDetails.active_members) {
			const notificationData = await notificationServices.getNotificationDetails({
				from: userData._id,
				to: data.room_id,
				status: CONSTANTS.NOTIFICATION_STATUS.SENT,
			});

			/* Create new notification */
			if(!notificationData) {
				const newNotificationData = {
					from: userData._id,
					to: data.room_id,
					type: CONSTANTS.NOTIFICATION_TYPES.NEW_MESSAGE,
					toType: CONSTANTS.CHAT_GROUP_REFERENCES.CHAT_GROUP,
					count: 1,
				};
				await notificationServices.createNotification(newNotificationData);
			} else {
				/* Increment counter if new meesage is sent to same counter */
				notificationData.count += 1;
				await notificationData.save();
			}
			
		}

		return socket
			.to(CONSTANTS.ROOM_PREFIX + data.room_id)
			.emit(
				CONSTANTS.EVENT_NAMES.NEW_MESSAGE,
				{
					sent_by: userData._id,
					name: userData.name,
					message: data.text,
					sent_at: newMessage.created_at,
				}
			);
	})

	socket.on(CONSTANTS.EVENT_NAMES.DISCONNECTING, () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
  });

	socket.on(CONSTANTS.EVENT_NAMES.DISCONNECT, async () => {
		const userData = socket.userData;
		userData.socket_id = '';
		await Promise.all([
			userData.save(),
			chatServices.deactivateUserInChatGroups(userData.chat_groups),
		]);
		return;
	})

	/* Debug to check Rooms and socket connections */
	socket.on('rooms', () => {
		const roomIds = io.of('/').adapter.rooms;
		const sids = io.of('/').adapter.sids;
		console.log({ roomIds: [...roomIds], sids: [...sids] });
		socket.emit('rooms', { roomIds: [...roomIds], sids: [...sids] });
	});
};

module.exports = socketHandler;
