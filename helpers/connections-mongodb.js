// const mongoose = require("mongoose");

// const connection = mongoose.createConnection("mongodb://localhost:27017/test");

// connection.on("connected", function () {
//     console.log(`Mongodb::: connected:::${this.name}`);
// });
// connection.on("disconnected", function () {
//     console.log(`Mongodb::: disconnected:::${this.name}`);
// });
// connection.on("error", function (error) {
//     console.log(`Mongodb::: error:::${JSON.stringify(error)}`);
// });

// process.on("SIGINT", async () => {
//     await connection.close();
//     process.exit(0);
// });

// module.exports = connection;
