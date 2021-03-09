const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const connectionSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true, unique: true, index: true },
        socket: { type: String, default: null, unique: true },
    }
);

module.exports = mongoose.model("connection", connectionSchema);