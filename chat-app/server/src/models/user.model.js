const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  access_token: String,
  status: Number,
  role: Number,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
