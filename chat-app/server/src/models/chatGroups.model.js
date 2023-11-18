const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatGroupSchema = new mongoose.Schema(
	{
		name: { type: Schema.Types.String },
		total_members: {
			type: Schema.Types.Number,
			max: 5,
		},
		type: { type: Schema.Types.Number },
		status: { type: Schema.Types.Number, default: 1 },
		participants: [
			{
				_id: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
				role: {
					type: Schema.Types.Number,
					
				}
			}
		],
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	}
);

const ChatGroupModel = mongoose.model('ChatGroup', ChatGroupSchema);

module.exports = ChatGroupModel;
