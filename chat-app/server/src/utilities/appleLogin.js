const verifyAppleIdToken = require('verify-apple-id-token').default;

const appleLogin = async (appleId) => {
	try {
		const APPLE_CLIENT_ID = 'APPLE_CLIENT_ID';

		const jwtClaims = await verifyAppleIdToken({
			idToken: appleId,
			clientId: APPLE_CLIENT_ID,
		});

		console.log("jwtClaims: ", jwtClaims);

		return {
			appleId: jwtClaims['sub'],
			verification: true,
		}
	} catch (error) {
		console.log('Apple login Error: ', error);
		return { verification: false };
	}
}

module.exports = appleLogin;