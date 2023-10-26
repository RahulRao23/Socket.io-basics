const userServices = require("../services/users.services");

const userController = {};

userController.getAllUsers = async (req, res) => {

  /* Handling request before proccessing */

  const users = await userServices.getAllUsers();
  console.log({users});

  /* Handling response from DB */
  
  res.send(users);
}

module.exports = userController;