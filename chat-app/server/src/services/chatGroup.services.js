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

chatServices.getUserChatGroups = async (userId) => {
	const userChatGroups = await ChatGroupModel.find({
		'participants._id': { $in: [userId ] }
	})
	.populate({
    path: 'participants._id',
		select: 'name email',
    options: { strictPopulate: false }
  }).lean();
	return userChatGroups;
}

chatServices.getChatGroupDetail = async (whereClause) => {
	return await ChatGroupModel.findOne(whereClause);
}

chatServices.activateUserInChatGroups = async (roomIdList) => {
	return await ChatGroupModel.updateMany(
		{ _id: { $in: roomIdList } },
		{ $inc: { active_members: 1 } }
	)
}

chatServices.deactivateUserInChatGroups = async (roomIdList) => {
	return await ChatGroupModel.updateMany(
		{ _id: { $in: roomIdList } },
		{ $dec: { active_members: -1 } }
	)
}

module.exports = chatServices;