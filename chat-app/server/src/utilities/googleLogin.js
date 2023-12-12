const { OAuth2Client } = require('google-auth-library');

const googleLogin = async (googleId) => {
	try {
		const client = new OAuth2Client('GOOGLE_CLIENT_ID');
		const ticket = await client.verifyIdToken({
			idToken: googleId,
			audience: 'GOOGLE_CLIENT_ID',
		});

		const payload = ticket.getPayload();

		return {
			userName: payload['name'],
			userEmail: payload['email'],
			verification: true,
			googleId: payload['sub'],
		};
		
	} catch (error) {
		console.log('Google Login Error', error);
		return { verification: false };
	}
}

module.exports = googleLogin;