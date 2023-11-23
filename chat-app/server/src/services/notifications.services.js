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
	 * 1. notification is to the rooms that user is part of AND not sent by user
	 * OR
	 * 2. notification is from user AND is of types friend request sent by user OR friend's response to user's friend request
	 * OR
	 * 3. notification is sent to user AND type is friend request
	 */
	return await NotificationsModel.find({
		$or: [
			{
				$and: [
					{ to_group: { $in: roomIdList } },
					{ from: { $ne: userId } },
				]
			}, 
			{
				$and: [
					{ from: userId },
					// { status: {$in: [CONSTANTS.FRIEND_REQUEST_STATUS.ACCEPTED, CONSTANTS.FRIEND_REQUEST_STATUS.DECLINED] } },
					{ type: { $in: [CONSTANTS.NOTIFICATION_TYPES.FRIEND_REQUEST, CONSTANTS.NOTIFICATION_TYPES.FRIEND_REQUEST_RESPONSE] } }
				]
			},
			{
				$and: [
					{ to_friend: userId },
					{ type: CONSTANTS.NOTIFICATION_TYPES.FRIEND_REQUEST }
				]
			}
		],
	})
	.populate({
    path: 'from to_friend',
		select: 'name email',
    options: { strictPopulate: false }
  })
	.populate({
    path: 'to_group',
		select: 'type',
    options: { strictPopulate: false }
  })
	.sort({ created_at: -1 });
}

module.exports = notificationServices;