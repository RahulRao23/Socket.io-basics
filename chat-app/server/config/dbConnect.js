const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'chat-app';

function dbConnect() {
	try {
		mongoose.connect(`${URI}/${DB_NAME}`);

		const dbConnection = mongoose.connection;

		dbConnection.once('open', () => {
			console.log('DB connection successful');
		});
		dbConnection.on('error', err => {
			console.error('DB connection error: ', err);
		});
	} catch (error) {
		console.error('DB connection error: ', error);
	}
}

async function dbDisconnect() { }

module.exports = {
	dbConnect,
	dbDisconnect,
};
