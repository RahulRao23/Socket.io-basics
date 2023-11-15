const express = require('express');
const {
	validateUserMiddleware,
	getAllUsers,
	signUp,
	userlogin,
	userLogout,
	sendFriendRequest,
} = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.use('/', validateUserMiddleware);

/* User Routes */
userRouter.get('/getAllUsers', getAllUsers);
userRouter.get('/debug', (req, res) => {
	res.json({ message: 'Debug API called ' });
});

userRouter.post('/signUp', signUp);

userRouter.post('/login', userlogin);

userRouter.post('/logout', userLogout);

userRouter.post('/sendFriendRequest', sendFriendRequest);

/* Error handling */
userRouter.use('/', (req, res, next) => {
	console.log('Route not found: ', req.url);
	res.status(404);
	res.send('404 Not Found');
});

module.exports = userRouter;
