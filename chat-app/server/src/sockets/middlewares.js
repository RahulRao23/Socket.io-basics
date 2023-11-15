const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userServices = require('../services/users.services');
const CONSTANTS = require('../utilities/constants');

const SocketMiddlewares = {};

SocketMiddlewares.ValidateUser = async (socket, next) => {
	try {
		const accessToken = socket.handshake.headers.access_token;

		if (!accessToken) {
			const errorData = { errName: 'BAD_REQUEST', message: "Access token missing." };
			socket.emit(CONSTANTS.EVENT_NAMES.INVALID_SOCKET, errorData);
			next(errorData);
			return;
		}

		const decodedToken = jwt.decode(accessToken);

		/* Validate user */
		const userData = await userServices.getUserDetails({ _id: decodedToken._id });
		if (!userData || userData.status === CONSTANTS.USER_STATUS.DELETED) {
			const errorData = { errName: 'UNAUTHORIZED', message: "User does not exist" };
			socket.emit(CONSTANTS.EVENT_NAMES.INVALID_SOCKET, errorData);
			next(errorData);
			return;
		}

		/* Validate access token */
		if (!userData.access_token) {
			const errorData = { errName: 'ALREADY_REPORTED', message: "User already logged out." };
			socket.emit(CONSTANTS.EVENT_NAMES.INVALID_SOCKET, errorData);
			next(errorData);
			return;
		}
		if (userData.access_token != accessToken) {
			const errorData = { errName: 'UNAUTHORIZED', message: "Invalid access_token." };
			socket.emit(CONSTANTS.EVENT_NAMES.INVALID_SOCKET, errorData);
			next(errorData);
			return;
		}
		
		/* Update socket id in DB */
		userData.socket_id = socket.id;
		await userData.save()

		next();
		return;
	} catch (error) {
		console.log("Socket error: ", error);
		throw error;
	}
}

module.exports = SocketMiddlewares;