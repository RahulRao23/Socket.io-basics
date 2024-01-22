const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConversationSchema = new mongoose.Schema(
	{
		sender: { type: Schema.Types.ObjectId, ref: 'User' },
		room_id: { type: Schema.Types.ObjectId, ref: 'ChatGroup' },
		text: { type: Schema.Types.String },
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	}
);

const ConversationModel = mongoose.model('Conversation', ConversationSchema);

module.exports = ConversationModel;
