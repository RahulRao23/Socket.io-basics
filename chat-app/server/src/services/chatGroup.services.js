const mongoose = require('mongoose');
const { ChatGroupModel } = require('../models/models');

const chatServices = {};

chatServices.getAllChatGroups = async (chatData) => {
	const friendRequests = await ChatGroupModel.find(chatData);
	return friendRequests;
};

chatServices.getAllChatGroupsAsPOJO = async chatData => {
	const friendRequests = await ChatGroupModel.find(chatData).lean();
	return friendRequests;
};

chatServices.createChatGroups = async chatData => {
	const newRequest = new ChatGroupModel(chatData);
	return await newRequest.save();
};

chatServices.updateChatGroups = async (whereClause, chatData) => {
	return await ChatGroupModel.updateOne(whereClause, chatData);
};

module.exports = chatServices;