const mongoose = require('mongoose');
const { ConversationModel } = require('../models/models');

const conversationService = {};

conversationService.createConversation = async (data) => {
	const newMessage = new ConversationModel(data);
	return await newMessage.save();
}

module.exports = conversationService;