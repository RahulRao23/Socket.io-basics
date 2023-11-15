const mongoose = require('mongoose');
const { NotificationsModel } = require('../models/models');

const notificationServices = {};

notificationServices.getAllNotifications = async (notificationData) => {
	const friendRequests = await NotificationsModel.find(notificationData);
	return friendRequests;
};

notificationServices.getAllNotificationsAsPOJO = async notificationData => {
	const friendRequests = await NotificationsModel.find(notificationData).lean();
	return friendRequests;
};

notificationServices.createNotification = async notificationData => {
	const newRequest = new NotificationsModel(notificationData);
	return await newRequest.save();
};

notificationServices.updateNotification = async (whereClause, notificationData) => {
	return await NotificationsModel.updateOne(whereClause, notificationData);
};

module.exports = notificationServices;