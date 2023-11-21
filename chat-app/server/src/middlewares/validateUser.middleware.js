const jwt = require('jsonwebtoken');

const userServices = require('../services/users.services');
const STATUS = require('../../config/statusCodes.json');
const CONSTANTS = require('../utilities/constants');


const validateUserMiddleware = async (req, res, next) => {

	const accessToken = req.headers.access_token;
	if (!accessToken) {
		return next(
			res.status(STATUS.BAD_REQUEST).send({
				error: 'BAD_REQUEST',
				message: 'Access token missing.',
			})
		);
	}

	const decodedToken = jwt.decode(accessToken);

	/* Validate user */
	const userData = await userServices.getUserDetails({
		_id: decodedToken._id,
	});
	if (!userData || userData.status === CONSTANTS.USER_STATUS.DELETED) {
		return next(
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'User does not exist',
			})
		);
	}

	/* Validate access token */
	if (!userData.access_token) {
		return next(
			res.status(STATUS.ALREADY_REPORTED).send({
				error: 'ALREADY_REPORTED',
				message: 'User already logged out.',
			})
		);
	}

	if (userData.access_token != accessToken) {
		return next(
			res.status(STATUS.UNAUTHORIZED).send({
				error: 'UNAUTHORIZED',
				message: 'Invalid access_token.',
			})
		);
	}

	/* Assign user data to local variables to access within the API */
	res.locals.accessToken = accessToken;
	res.locals.userData = userData;
	res.locals.decodedToken = decodedToken;
	next();
}

module.exports = validateUserMiddleware;