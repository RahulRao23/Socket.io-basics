const mongoose = require ('mongoose');
const {Schema} = mongoose;

const UserSchema = new mongoose.Schema (
  {
    name: {type: String},
    email: {type: String},
    password: {type: String},
    access_token: {type: String},
    socket_id: {type: String},
    status: {type: Number},
    chat_groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ChatGroup',
      },
    ],
  },
  {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const UserModel = mongoose.model ('User', UserSchema);

module.exports = UserModel;
