const express = require('express');
const {
	createChatGroup,
	getUserChatGroups,
} = require('../controllers/chatGroup.controller');

const getRequestParamsMiddleware = require('../middlewares/getRequestParams.middleware');
const validateUserMiddleware = require('../middlewares/validateUser.middleware');

const chatRouter = express.Router();

chatRouter.get('/getUserChatGroups', validateUserMiddleware, getRequestParamsMiddleware, getUserChatGroups);

chatRouter.post('/createChatGroup', validateUserMiddleware, getRequestParamsMiddleware, createChatGroup);

module.exports = chatRouter;