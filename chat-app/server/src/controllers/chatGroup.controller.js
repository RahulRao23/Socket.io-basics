const chatServices = require('../services/chatGroup.services');
const userServices = require('../services/users.services');
const notificationService = require('../services/notifications.services');
const STATUS = require('../../config/statusCodes.json');
const CONSTANTS = require('../utilities/constants');

const jwt = require('jsonwebtoken');

const chatController = {};

chatController.getUserChatGroups = async (req, res) => {
	const userData = res.locals.userData;
	const chatGroups = await chatServices.getUserChatGroups(userData._id);
	return res
	.status(STATUS.SUCCESS)
	.send({
		user_chat_groups: chatGroups
	});
}

chatController.createChatGroup = async (req, res) => {
	try {
		const userData = res.locals.userData;
		const data = res.locals.reqParams;

		if (!data.email && !data.username && !data.password) {
			return res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required data not sent',
			});
		}

		/* Yet to be implemented */
	} catch (error) {
		console.log('Create ChatGroup ERROR: ', error);
		return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
	}
}

module.exports = chatController;