const express = require("express");
const route = express.Router();

const { verifyAccessToken } = require("../helpers/jwt-service");

const UserController = require("../controllers/User.controller.js");
const checkRole = require("../middlewares/roleHandler.js");

route.post("/register", UserController.register);

route.post("/refresh-token", UserController.refreshToken);

route.post("/login", UserController.login);

route.delete("/logout", UserController.logout);

route.post("/get-list", verifyAccessToken, UserController.getList);

route.get(
    "/get-all",
    verifyAccessToken,
    checkRole("admin"),
    UserController.getUsers
);

route.delete(
    "/delete",
    verifyAccessToken,
    checkRole("admin"),
    UserController.deleteUser
);

route.put(
    "/update",
    verifyAccessToken,
    checkRole("admin"),
    UserController.updateUserByAdmin
);

route.put("/:userId", verifyAccessToken, UserController.updateUser);

module.exports = route;
