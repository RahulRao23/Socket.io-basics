const express = require('express');
const {
	validateUserMiddleware,
	debug,
	signUp,
	userlogin,
	userLogout,
	sendFriendRequest,
	respondToRequest,
	getAllNotifications
} = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.use('/', validateUserMiddleware);

/* User Routes */
userRouter.get('/debug', debug);

userRouter.get('/getNotification', getAllNotifications);

userRouter.post('/signUp', signUp);

userRouter.post('/login', userlogin);

userRouter.post('/logout', userLogout);

userRouter.post('/sendFriendRequest', sendFriendRequest);

userRouter.post('/respondToRequest', respondToRequest);

/* Error handling */
userRouter.use('/', (req, res, next) => {
	console.log('Route not found: ', req.url);
	res.status(404);
	res.send('404 Not Found');
});

module.exports = userRouter;
