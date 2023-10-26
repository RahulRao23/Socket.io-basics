const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  access_token: String,
  status: Number,
  role: Number
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}
);

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
