const User = require("../models/User.model");
const { userValidate } = require("../helpers/validation");
const client = require("../helpers/connections-redis");
const createError = require("http-errors");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../helpers/jwt-service");

module.exports = {
    // REGISTER

    register: async (req, res, next) => {
        try {
            const { email, username, password } = req.body;
            const { error } = userValidate(req.body);
            if (!username) {
                throw createError(400, "Username is required");
            }
            if (error) {
                throw createError(error.details[0].message);
            }

            // Check if email already exists
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                throw createError.Conflict(`${email} is already registered`);
            }

            // Check if username already exists
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                throw createError.Conflict(
                    `Username ${username} is already taken`
                );
            }

            const user = new User({ email, username, password });
            const savedUser = await user.save();

            res.json({
                status: "success",
                elements: savedUser,
            });
        } catch (error) {
            next(error);
        }
    },

    // REFRESH TOKEN

    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest();

            const { userId } = await verifyRefreshToken(refreshToken);
            const accessToken = await signAccessToken(userId);
            const refresh_token = await signRefreshToken(userId);

            res.json({
                accessToken,
                refresh_token,
            });
        } catch (error) {
            next(error);
        }
    },

    // LOGIN

    login: async (req, res, next) => {
        try {
            const { error } = userValidate(req.body);

            if (error) {
                throw createError(error.details[0].message);
            }
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                throw createError.NotFound("User not registered");
            }

            const isValid = await user.isCheckPassword(password);
            if (!isValid) {
                throw createError.Unauthorized();
            }
            const accessToken = await signAccessToken(user._id);
            const refreshToken = await signRefreshToken(user._id);

            res.json({
                accessToken,
                refreshToken,
            });
        } catch (error) {
            next(error);
        }
    },

    // LOGOUT

    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw createError.BadRequest("Missing refresh token");
            }

            const { userId } = await verifyRefreshToken(refreshToken);

            await client.del(userId.toString());

            res.json({
                message: "Logout success!",
            });
        } catch (error) {
            next(error);
        }
    },

    // GET LIST

    getList: (req, res, next) => {
        console.log(req.headers);
        const listUsers = [
            {
                email: "abc@gmail.com",
            },
            {
                email: "def@gmail.com",
            },
        ];
        res.json({
            listUsers,
        });
    },
};
