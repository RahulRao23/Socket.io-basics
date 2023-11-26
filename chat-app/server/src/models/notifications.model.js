const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationsSchema = new mongoose.Schema(
	{
		from: { type: Schema.Types.ObjectId, ref: 'User' },
		to: { type: Schema.Types.ObjectId, ref: 'User' },
		type: { type: Schema.Types.Number },
		message_count: { type: Schema.Types.Number },
		status: { type: Schema.Types.Number, default: 1 },
		data: { type: Schema.Types.Object },
		view_status: { type: Schema.Types.Number },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	}
);

const NotificationsModel = mongoose.model('Notifications', NotificationsSchema);

module.exports = NotificationsModel;
