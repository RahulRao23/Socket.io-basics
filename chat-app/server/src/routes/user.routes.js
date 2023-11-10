const express = require('express');
const {
	getAllUsers,
	signUp,
	userlogin,
	userLogout,
} = require('../controllers/user.controller');

const userRouter = express.Router();

/* User Routes */
userRouter.get('/getAllUsers', getAllUsers);
userRouter.get('/debug', (req, res) => {
	res.json({ message: 'Debug API called ' });
});

userRouter.post('/signUp', signUp);

userRouter.post('/login', userlogin);

userRouter.post('/logout', userLogout);

/* Error handling */
userRouter.use('/', (req, res, next) => {
	console.log('Route not found: ', req.url);
	res.status(404);
	res.send('404 Not Found');
});

module.exports = userRouter;
