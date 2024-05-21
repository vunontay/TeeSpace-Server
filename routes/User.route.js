const express = require("express");
const route = express.Router();

const { verifyAccessToken } = require("../helpers/jwt-service");

const UserController = require("../controllers/User.controller.js");

route.post("/register", UserController.register);

route.post("/refresh-token", UserController.refreshToken);

route.post("/login", UserController.login);

route.delete("/logout", UserController.logout);

route.post("/get-list", verifyAccessToken, UserController.getList);

module.exports = route;
