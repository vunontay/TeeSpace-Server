const redis = require("redis");

const dotenv = require("dotenv");
dotenv.config();

const REDIS_CONFIG = {
    url: process.env.REDIS_URL,
    socket: {
        tls: true,
    },
};

const client = redis.createClient(REDIS_CONFIG);

client.on("error", (err) => console.log("Redis Client Error", err));

const connectionRedis = async () => {
    await client.connect();
    console.log("Redis connected");
};
connectionRedis();

module.exports = client;
