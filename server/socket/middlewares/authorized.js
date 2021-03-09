const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
exports.isAuthorized = (socket, next) => {
    jwt.verify(socket.handshake.query.token, jwtSecretKey, async (err, data) => {
        if (err) {
            next(new Error("Not Authorized"));
        } else {
            next();
        }
    });
}