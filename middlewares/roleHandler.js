const createError = require("http-errors");
const { verifyAccessToken } = require("../helpers/jwt-service");
const User = require("../models/User.model");

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        verifyAccessToken(req, res, async (err) => {
            if (err) {
                return next(err);
            }

            try {
                const user = await User.findById(req.payload.userId);
                if (!user) {
                    return next(createError.Unauthorized("User not found"));
                }

                if (user.role !== requiredRole) {
                    return next(
                        createError.Forbidden(
                            "You don't have permission to access this resource"
                        )
                    );
                }

                req.user = user;
                next();
            } catch (error) {
                next(createError.InternalServerError(error.message));
            }
        });
    };
};

module.exports = checkRole;
