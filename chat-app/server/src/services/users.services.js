const mongoose = require('mongoose');
const User = require('../models/user.model');

const userServices = {};

userServices.getAllUsers = async () => {
  const users = await User.find();
  return users;
}

module.exports = userServices;