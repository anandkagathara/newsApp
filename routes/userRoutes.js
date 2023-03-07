const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


module.exports = (socket) => {
  socket.on("signup", userController.signup);
  socket.on("login", userController.login);
};
