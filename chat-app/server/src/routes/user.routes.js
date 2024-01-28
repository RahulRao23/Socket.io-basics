const express = require('express');
const {
	debug,
	signUp,
	userlogin,
	userLogout,
	sendFriendRequest,
	respondToRequest,
	getAllNotifications,
	getFriendsList,
} = require('../controllers/user.controller');

const getRequestParamsMiddleware = require('../middlewares/getRequestParams.middleware');
const validateUserMiddleware = require('../middlewares/validateUser.middleware');

const userRouter = express.Router();

/* User Routes */
userRouter.get('/debug', debug);

userRouter.get('/getNotification', validateUserMiddleware, getRequestParamsMiddleware, getAllNotifications);

userRouter.get('/getFriendsList', getRequestParamsMiddleware, validateUserMiddleware, getFriendsList);

userRouter.post('/signUp', getRequestParamsMiddleware, signUp);

userRouter.post('/login', getRequestParamsMiddleware, userlogin);

userRouter.post('/logout', validateUserMiddleware, getRequestParamsMiddleware, userLogout);

userRouter.post('/sendFriendRequest', validateUserMiddleware, getRequestParamsMiddleware, sendFriendRequest);

userRouter.post('/respondToRequest', validateUserMiddleware, getRequestParamsMiddleware, respondToRequest);

/* Error handling */
userRouter.use('/', (req, res, next) => {
	console.log('Route not found: ', req.url);
	res.status(404);
	res.send('404 Not Found');
});

module.exports = userRouter;
