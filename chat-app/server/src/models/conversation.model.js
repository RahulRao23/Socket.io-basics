const mongoose = require ('mongoose');

const ConversationSchema = new mongoose.Schema (
  {
    sender: {type: String},
    room_id: {type: String},
    text: {type: String},
  },
  {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const ConversationModel = mongoose.model ('Conversation', ConversationSchema);

module.exports = ConversationModel;
