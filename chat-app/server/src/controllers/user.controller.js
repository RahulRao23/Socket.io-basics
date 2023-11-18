const userServices = require('../services/users.services');
const notificationService = require('../services/notifications.services');
const chatServices = require('../services/chatGroup.services');
const STATUS = require('../../config/statusCodes.json');
const CONSTANTS = require('../utilities/constants');
const PROTECTED_APIS = require('../../config/protectedApis.json');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {};

userController.validateUserMiddleware = async (req, res, next) => {
	const apiName = req.path.split('/')[1];
	if (Object.values(PROTECTED_APIS.USER).includes(apiName)) {
		const accessToken = req.headers.access_token;

		if (!accessToken) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Access token missing.',
			});
			return;
		}

		const decodedToken = jwt.decode(accessToken);

		/* Validate user */
		const userData = await userServices.getUserDetails({
			_id: decodedToken._id,
		});
		if (!userData || userData.status === CONSTANTS.USER_STATUS.DELETED) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'User does not exist',
			});
			return;
		}

		/* Validate access token */
		if (!userData.access_token) {
			res.status(STATUS.ALREADY_REPORTED).send({
				error: 'ALREADY_REPORTED',
				message: 'User already logged out.',
			});
			return;
		}

		if (userData.access_token != accessToken) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid access_token.',
			});
			return;
		}

		/* Assign user data to local variables to access within the API */
		res.locals.accessToken = accessToken;
		res.locals.userData = userData;
		res.locals.decodedToken = decodedToken;
	}
	res.locals.reqParams = Object.keys(req.body).length ? req.body : req.query;
	next();
}

userController.debug = async (req, res) => {
	/* Handling request before proccessing */

	// const users = await userServices.getAllUsers();
	// console.log({ users });

	const io = req.app.get('io');
	io
		.to(req.room_id)
		.emit(
			req.event_name,
			{ message: `Debug socket to ${req.room_id}` }
		);

	/* Handling response from DB */

	res.send({ mesg: "debug response" });
};

/** Sign Up
 * 
 * @param {{email, username, password}} req 
 * @param {*} res 
 * @returns 
 */
userController.signUp = async (req, res) => {
	try {
		const data = res.locals.reqParams;

		if (!data.email && !data.username && !data.password) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required data not sent',
			});
			return;
		}

		const hashedPassword = bcrypt.hashSync(
			data.password,
			CONSTANTS.SALT_ROUNDS
		);

		const userData = await userServices.createUser({
			name: data.username,
			email: data.email,
			password: hashedPassword,
			status: CONSTANTS.USER_STATUS.ACTIVE,
		});

		res.status(STATUS.SUCCESS).send({
			message: 'SUCCESS',
			data: userData,
		});
		return;
	} catch (error) {
		console.log('Sign Up ERROR: ', error);
		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
};

/** User Login
 * 
 * @param {{email, username, password}} req 
 * @param {*} res 
 * @returns 
 */
userController.userlogin = async (req, res) => {
	try {
		/* Validate required fields */
		const data = res.locals.reqParams;
		if ((!data.email || !data.username) && !data.password) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required data not sent',
			});
			return;
		}
		console.log("User IP: ", req.ip, req.socket.remoteAddress, req.connection.remoteAddress);

		const queryData = { status: CONSTANTS.USER_STATUS.ACTIVE };
		if (data.email) queryData.email = data.email;
		if (data.username) queryData.name = data.username;

		/* Get user data */
		const userData = await userServices.getUserDetails(queryData);

		if (!userData) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'User does not exist',
			});
			return;
		}
		/* Validate password for user */
		if (!bcrypt.compareSync(data.password, userData.password)) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid password',
			});
			return;
		}

		const signData = {
			_id: userData._id,
			chat_groups: userData.chat_groups,
		};

		/* Generate access token and update in DB */
		var accessToken = jwt.sign(signData, CONSTANTS.JWT_PRIVATE_KEY);

		/* Assign new access token and update DB */
		userData.access_token = accessToken;
		const updatedUserData = await userData.save();

		res.status(STATUS.SUCCESS).send({
			message: 'SUCCESS',
			data: updatedUserData,
		});
		return;
	} catch (error) {
		console.log('Login ERROR: ', error);
		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
};

/** User Logout
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
userController.userLogout = async (req, res) => {
	try {

		/* Remove access token on logout */
		const userData = res.locals.userData;
		userData.access_token = '';
		await userData.save();

		res.status(STATUS.SUCCESS).send({
			message: 'SUCCESS',
			data: {},
		});
		return;
	} catch (error) {
		console.log('Logout Error: ', error);

		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
};
/** Send Friend Request
 * 
 * @param {friend_id} req 
 * @param {*} res 
 * @returns 
 */
userController.sendFriendRequest = async (req, res) => {
	try {
		const data = res.locals.reqParams;
		const userData = res.locals.userData;

		if (!data.friend_id) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required fields are missing.',
			});
			return;
		}

		const friendData = await userServices.getUserDetailsAsPOJO({
			_id: data.friend_id,
		});
		if (!friendData || friendData.status === CONSTANTS.USER_STATUS.DELETED) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid friend_id. User does not exist',
			});
			return;
		}

		/* Validate user socket connection */
		const io = req.app.get('io');
		const userSocket = io.sockets.sockets.get(userData.socket_id);
		if (!userSocket) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid socket id',
			});
			return;
		}

		/* Create a friend request entry */
		const friendRequestData = {
			from: userData._id,
			to: friendData._id,
			type: CONSTANTS.NOTIFICATION_TYPES.FRIEND_REQUEST,
		};

		const notificationData = await notificationService.createNotification(friendRequestData);

		/* If friend logged in then send request */
		if (friendData.socket_id) {
			friendRequestData.status = CONSTANTS.FRIEND_REQUEST_STATUS.RECEIVED_BY_FRIEND;
			io
				.to(friendData.socket_id)
				.emit(
					CONSTANTS.EVENT_NAMES.FRIEND_REQUEST_RECEIVED,
					{
						notification_id: notificationData._id,
						from_id: userData._id,
						name: userData.name,
					}
				);
		}


		userSocket.emit(
			CONSTANTS.EVENT_NAMES.FRIEND_REQUEST_SENT,
			{
				status: friendRequestData.status,
			}
		);

		res.status(STATUS.SUCCESS).send({
			message: 'SUCCESS',
			data: {},
		});
		return;

	} catch (error) {
		console.log("sendFriendRequest Error: ", error);

		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
}

/**
 * 
 * @param {{notification_id, response}} req 
 * @param {*} res 
 * @returns 
 */
userController.respondToRequest = async (req, res) => {
	try {
		const data = res.locals.reqParams;
		const userData = res.locals.userData;

		if (!data.notification_id || !data.response) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required fields are missing.',
			});
			return;
		}

		if (
			data.response != CONSTANTS.FRIEND_REQUEST_STATUS.ACCEPTED &&
			data.response != CONSTANTS.FRIEND_REQUEST_STATUS.DECLINED
		) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid response',
			});
			return;
		}

		const notificationData = await notificationService.getNotificationDetails({ _id: data.notification_id });
		if (!notificationData) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid notification_id. Notification does not exist',
			});
			return;
		}

		notificationData.status = data.response;
		await notificationData.save();

		const friendData = await userServices.getUserDetails({ _id: notificationData.from });

		if (data.response == CONSTANTS.FRIEND_REQUEST_STATUS.ACCEPTED) {
			const newChat = await chatServices.createChatGroups({
				total_members: 2,
				type: CONSTANTS.CHAT_GROUP_TYPES.PERSONAL,
				participants: [
					{
						_id: notificationData.from,
						role: CONSTANTS.USER_ROLES.PARTICIPANT,
					},
					{
						_id: notificationData.to,
						role: CONSTANTS.USER_ROLES.PARTICIPANT,
					},
				]
			});

			userData.friends.push(notificationData.from);
			userData.chat_groups.push(newChat._id);
			await userData.save();

			friendData.friends.push(notificationData.to);
			friendData.chat_groups.push(newChat._id);
			await friendData.save();

			const roomId = CONSTANTS.ROOM_PREFIX + newChat._id;
			const io = req.app.get('io');
			const userSocket = io.sockets.sockets.get(userData.socket_id);
			userSocket.join(roomId);

			if (friendData.socket_id) {
				const friendSocket = io.sockets.sockets.get(friendData.socket_id);
				friendSocket.join(roomId);
			}

			io
				.to(roomId)
				.emit(
					CONSTANTS.EVENT_NAMES.FRIEND_ADDED,
					{
						chat_group_id: newChat._id,
					}
				);

			res.status(STATUS.SUCCESS).send({
				message: 'SUCCESS',
				data: {},
			});
			return;
		}

		io
			.to(friendData.socket_id)
			.emit(
				CONSTANTS.EVENT_NAMES.FRIEND_REQUEST_DECLINE,
				{ 
					notification_id: notificationData._id,
					from: userData._id,	
				}
			);

	} catch (error) {
		console.log("respondToRequest Error: ", error);
		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
}

module.exports = userController;
