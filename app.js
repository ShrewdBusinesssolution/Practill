require("module-alias/register");
require("dotenv").config();

const express = require("express");
const app = express();
const { json } = require("express");
const cors = require("cors");
const corsOptions = require("@config/corsOptions");
const createError = require("http-errors");

// Cross Origin Resource Sharing - third party middleware
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// IMAGE ROUTES
app.use("/uploads", express.static("uploads"));
// END IMAGE ROUTES

// ROUTE
const api = require("@routes/api");
app.use("/api/v1", api);
// END ROUTE

// DEFAULT ROUTES
app.use(async (req, res, next) => {
    next(createError.NotFound("This route does not exist"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            message: err.message,
        },
    });
});
// END DEFAULT ROUTES

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});

module.exports = app;
