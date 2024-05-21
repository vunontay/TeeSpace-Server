const express = require("express");
const app = express();
const UserRoute = require("./routes/User.route");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/connections-multi-mongodb");
require("./helpers/connections-redis");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", UserRoute);

app.use((req, res, next) => {
    next(createError.NotFound("This route does not exist."));
});

app.use((error, req, res, next) => {
    res.json({
        status: error.status || 500,
        message: error.message,
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on post ${PORT}`);
});
