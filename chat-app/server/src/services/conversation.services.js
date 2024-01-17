const mongoose = require('mongoose');
const { ConversationModel } = require('../models/models');

const conversationService = {};

conversationService.createConversation = async (data) => {
	const newMessage = new ConversationModel(data);
	return await newMessage.save();
}

conversationService.getChatMessages = async (roomId, offset) => {
	return await ConversationModel.find({
		room_id: roomId,
	})
	.sort({ created_at: -1 })
	.skip(offset * 20)
	.limit(20);
}

module.exports = conversationService;