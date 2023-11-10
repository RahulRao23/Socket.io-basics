const userServices = require('../services/users.services');
const STATUS = require('../../config/statusCodes.json');
const CONSTANTS = require('../utilities/constants');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {};

userController.getAllUsers = async (req, res) => {
	/* Handling request before proccessing */

	const users = await userServices.getAllUsers();
	console.log({ users });

	/* Handling response from DB */

	res.send(users);
};

userController.signUp = async (req, res) => {
	try {
		const data = Object.keys(req.body).length ? req.body : req.query;

		console.log('BODY', req.body, req.query);
		if (!data.email && !data.username && !data.password) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required data not sent',
			});
			return;
		}

		console.log({ pwd: data.password, salt: CONSTANTS.SALT_ROUNDS });
		const hashedPassword = bcrypt.hashSync(
			data.password,
			CONSTANTS.SALT_ROUNDS
		);

		const userData = await userServices.createUser({
			name: data.username,
			email: data.email,
			password: hashedPassword,
			status: CONSTANTS.USER_STATUS.ACTIVE,
		});

		res.status(STATUS.SUCCESS).send({
			message: 'SUCCESS',
			data: userData,
		});
		return;
	} catch (error) {
		console.log('Sign Up ERROR: ', error);
		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
};

userController.userlogin = async (req, res) => {
	try {
		/* Validate required fields */
		const data = Object.keys(req.body).length ? req.body : req.query;
		if ((!data.email || !data.username) && !data.password) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Required data not sent',
			});
			return;
		}

		const queryData = { status: CONSTANTS.ACTIVE };
		if (data.email) queryData.email = data.email;
		if (data.username) queryData.name = data.username;

		/* Get user data */
		const userData = await userServices.getUserDetailsAsPOJO(queryData);

		if (!userData) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'User does not exist',
			});
			return;
		}
		/* Validate password for user */
		if (!bcrypt.compareSync(data.password, userData.password)) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid password',
			});
			return;
		}

		const signData = {
			_id: userData._id,
			chat_groups: userData.chat_groups,
		};

		/* Generate access token and update in DB */
		var accessToken = jwt.sign(signData, CONSTANTS.JWT_PRIVATE_KEY);
		const updatedUserData = await userServices.updateUser(
			{ _id: userData._id },
			{ access_token: accessToken }
		);

		res.status(STATUS.SUCCESS).send({
			message: 'SUCCESS',
			data: {
				user_id: userData._id,
				username: userData.name,
				access_token: accessToken,
			},
			metadata: updatedUserData,
		});
		return;
	} catch (error) {
		console.log('Login ERROR: ', error);
		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
};

userController.userLogout = async (req, res) => {
	try {
		const accessToken = req.headers.access_token;

		if (!accessToken) {
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Access token missing.',
			});
			return;
		}

		const decodedToken = jwt.decode(accessToken);
		console.log({ decodedToken });

		const userData = await userServices.getUserDetailsAsPOJO({
			_id: decodedToken._id,
		});
		if (!userData || userData.status === CONSTANTS.USER_STATUS.DELETED) {
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'User does not exist',
			});
			return;
		}

		if (!userData.access_token) {
			res.status(STATUS.ALREADY_REPORTED).send({
				error: 'ALREADY_REPORTED',
				message: 'User already logged out.',
			});
			return;
		}

		const updatedUserData = await userServices.updateUser(
			{ _id: decodedToken._id },
			{ access_token: '' }
		);

		res.status(STATUS.SUCCESS).send({
			message: 'SUCCESS',
			data: {},
			metadata: updatedUserData,
		});
		return;
	} catch (error) {
		console.log('Logout Error: ', error);

		res.status(STATUS.INTERNAL_SERVER_ERROR).send({
			error: 'INTERNAL_SERVER_ERROR',
			message: error.message ? error.message : 'Something went wrong',
		});
		return;
	}
};

module.exports = userController;
