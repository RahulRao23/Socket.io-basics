const chatServices = require('../services/chatGroup.services');
const userServices = require('../services/users.services');
const notificationService = require('../services/notifications.services');
const STATUS = require('../../config/statusCodes.json');
const CONSTANTS = require('../utilities/constants');

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

		if (!data.name) {
			return res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required data not sent',
			});
		}

		const newGroup = await chatServices.createChatGroups({
			name: data.name,
			total_members: 1,
			type: CONSTANTS.CHAT_GROUP_TYPES.GROUP,
			active_members: 1,
			participants: [{
				_id: userData._id,
				role: CONSTANTS.USER_ROLES.GROUP_ADMIN,
			}]
		});

		userData.chat_groups.push(newGroup._id);
		await userData.save();

		const io = req.app.get('io');
		const userSocket = io.sockets.sockets.get(userData.socket_id);
		userSocket.join(CONSTANTS.ROOM_PREFIX + newGroup._id);

		return res
			.status(STATUS.SUCCESS)
			.send({
				group_id: newGroup._id,
				group_name: newGroup.name,
			});

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