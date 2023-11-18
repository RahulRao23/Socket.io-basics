const mongoose = require('mongoose');
const { NotificationsModel } = require('../models/models');

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

module.exports = notificationServices;