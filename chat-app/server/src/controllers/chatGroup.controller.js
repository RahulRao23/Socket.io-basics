const chatServices = require('../services/chatGroup.services');
const userServices = require('../services/users.services');
const notificationService = require('../services/notifications.services');
const STATUS = require('../../config/statusCodes.json');
const CONSTANTS = require('../utilities/constants');
const PROTECTED_APIS = require('../../config/protectedApis.json');

const jwt = require('jsonwebtoken');

const chatController = {};

chatController.validateUserMiddleware = async (req, res, next) => {
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

chatController.getUserChatGroups = async (req, res) => {
	const userData = res.locals.userData;
	const chatGroups = await chatServices.getUserChatGroups(userData._id);
	res
	.status(STATUS.SUCCESS)
	.send({
		user_chat_groups: chatGroups
	});
	return;
}

chatController.createChatGroup = async (req, res) => {
	try {
		const userData = res.locals.userData;
		const data = res.locals.reqParams;

		if (!data.email && !data.username && !data.password) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required data not sent',
			});
			return;
		}

		/* Yet to be implemented */
	} catch (error) {
		console.log('Create ChatGroup ERROR: ', error);
		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
}

module.exports = chatController;