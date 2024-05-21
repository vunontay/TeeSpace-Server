const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../helpers/connections-redis");

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        };
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "1m",
        };

        JWT.sign(payload, secret, options, (error, token) => {
            if (error) reject(error);
            resolve(token);
        });
    });
};

const verifyAccessToken = (req, res, next) => {
    if (!req.headers["authorization"]) {
        return next(createError.Unauthorized());
    }
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    // start verify token
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
        if (error) {
            if (error.name === "JsonWebTokenError") {
                return next(createError.Unauthorized());
            }
            return next(createError.Unauthorized(error.message));
        }
        req.payload = payload;
        next();
    });
};

module.exports = verifyAccessToken;

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (error, payload) => {
                if (error) {
                    return reject(error);
                }
                try {
                    const storedToken = await client.get(payload.userId);
                    if (refreshToken === storedToken) {
                        resolve(payload);
                    } else {
                        reject(createError.Unauthorized());
                    }
                } catch (error) {
                    reject(createError.InternalServerError());
                }
            }
        );
    });
};

const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        };
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: "1y", // Thời hạn 1 năm
        };
        JWT.sign(payload, secret, options, async (err, token) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                // Set token
                await client.set(userId.toString(), token);
                // Đặt TTL cho key
                await client.expire(userId.toString(), 365 * 24 * 60 * 60); // Thời gian hết hạn tính bằng giây (1 năm)
                resolve(token);
            } catch (err) {
                reject(createError.InternalServerError());
            }
        });
    });
};

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
