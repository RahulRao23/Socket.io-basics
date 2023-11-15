const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationsSchema = new mongoose.Schema(
	{
		from: { type: Schema.Types.ObjectId },
		to: { type: Schema.Types.ObjectId },
		type: { type: Schema.Types.Number },
		status: { type: Schema.Types.Number, default: 1 }
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	}
);

const NotificationsModel = mongoose.model('Notifications', NotificationsSchema);

module.exports = NotificationsModel;
