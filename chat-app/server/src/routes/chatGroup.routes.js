const express = require('express');
const {
	createChatGroup,
	getUserChatGroups,
	getChatMessages,
} = require('../controllers/chatGroup.controller');

const getRequestParamsMiddleware = require('../middlewares/getRequestParams.middleware');
const validateUserMiddleware = require('../middlewares/validateUser.middleware');

const chatRouter = express.Router();

chatRouter.get('/getUserChatGroups', validateUserMiddleware, getRequestParamsMiddleware, getUserChatGroups);

chatRouter.get('/getChatMessages', validateUserMiddleware, getRequestParamsMiddleware, getChatMessages);

chatRouter.post('/createChatGroup', validateUserMiddleware, getRequestParamsMiddleware, createChatGroup);

module.exports = chatRouter;