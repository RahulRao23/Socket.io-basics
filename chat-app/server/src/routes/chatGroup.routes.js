const express = require('express');
const {
	validateUserMiddleware,
	createChatGroup,
} = require('../controllers/chatGroup.controller');

const chatRouter = express.Router();

chatRouter.use('/', validateUserMiddleware);

chatRouter.post('/createChatGroup', createChatGroup);

module.exports = chatRouter;