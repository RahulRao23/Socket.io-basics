const express = require('express');
const {
	validateUserMiddleware,
	createChatGroup,
	getUserChatGroups,
} = require('../controllers/chatGroup.controller');

const chatRouter = express.Router();

chatRouter.use('/', validateUserMiddleware);

chatRouter.get('/getUserChatGroups', getUserChatGroups);

chatRouter.post('/createChatGroup', createChatGroup);

module.exports = chatRouter;