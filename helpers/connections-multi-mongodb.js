const mongoose = require("mongoose");
require("dotenv").config();

function newConnection(url, name) {
    const connection = mongoose.createConnection(url);

    connection.on("connected", function () {
        console.log(`Mongodb::: connected:::${name}`);
    });
    connection.on("disconnected", function () {
        console.log(`Mongodb::: disconnected:::${name}`);
    });
    connection.on("error", function (error) {
        console.log(`Mongodb::: error:::${JSON.stringify(error)}`);
    });

    return connection;
}

// make connection to DB test
const DB_URL = {
    userName: process.env.CLOUD_DB_USERNAME,
    password: process.env.CLOUD_DB_PASSWORD,
    url: `mongodb+srv://${process.env.CLOUD_DB_USERNAME}:${process.env.CLOUD_DB_PASSWORD}@cluster0.mg5yqse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
};

const TeeSpaceDbConnection = newConnection(DB_URL.url, "TeeSpaceDbConnection");

// const testConnection = newConnection(process.env.URL_MONGODB_TEST);
// const UserConnection = newConnection(process.env.URL_MONGODB_USERS);

module.exports = {
    // testConnection,
    // UserConnection,
    TeeSpaceDbConnection,
};
