const mongoose = require('mongoose');
const { NotificationsModel } = require('../models/models');
const CONSTANTS = require('../utilities/constants');

const notificationServices = {};

notificationServices.getAllNotifications = async (notificationData) => {
	return await NotificationsModel.find(notificationData);
};

notificationServices.getAllNotificationsAsPOJO = async notificationData => {
	return await NotificationsModel.find(notificationData).lean();
};

notificationServices.getNotificationDetails = async notificationData => {
	return await NotificationsModel.findOne(notificationData);
}

notificationServices.createNotification = async notificationData => {
	const newNotification = new NotificationsModel(notificationData);
	return await newNotification.save();
};

notificationServices.updateNotification = async (whereClause, notificationData) => {
	return await NotificationsModel.updateOne(whereClause, notificationData);
};

notificationServices.getUserNotifications = async(userId) => {
	/* Get notifications sent to user or friend request responses */
	return await NotificationsModel.find({
		$or: [
			{
				to: userId
			}, 
			{
				$and: [
					{ from: userId },
					{ status: {$in: [CONSTANTS.FRIEND_REQUEST_STATUS.ACCEPTED, CONSTANTS.FRIEND_REQUEST_STATUS.DECLINED] } },
					{ type: CONSTANTS.NOTIFICATION_TYPES.FRIEND_REQUEST }
				]
			}
		],
	})
	.populate('User')
	.sort({ created_at: -1 });
}

module.exports = notificationServices;