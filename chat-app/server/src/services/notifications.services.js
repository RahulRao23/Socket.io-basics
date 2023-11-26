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

notificationServices.getUserNotifications = async(userId, roomIdList) => {
	/* Get notifications sent to user or friend request responses */
	/**
	 * Select notifications where
	 * 1. notification is to the user
	 * OR
	 * 2. notification is from user AND is friend's response to user's friend request OR friend request sent by user
	 */
	return await NotificationsModel.find({
		$or: [
			{
				to: userId
			},
			{
				$and: [
					{ from: userId },
					{ type: { $in: [CONSTANTS.NOTIFICATION_TYPES.FRIEND_REQUEST, CONSTANTS.NOTIFICATION_TYPES.FRIEND_REQUEST_RESPONSE] } },
				]
			}, 
		],
	})
	.populate({
    path: 'from to',
		select: 'name email',
    options: { strictPopulate: false }
  })
	.sort({ created_at: -1 });
}

// notificationServices.deleteNotification = async (notificationIdList) => {
// 	return await NotificationsModel.deleteMany({ notification_id })
// }

notificationServices.createMultipleNotifications = async (notificationList) => {
	return await NotificationsModel.insertMany(notificationList);
}

module.exports = notificationServices;