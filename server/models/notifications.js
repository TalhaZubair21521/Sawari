const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        id: Schema.ObjectId,
        room: { type: Schema.Types.ObjectId, ref: "room", required: true },
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        reciever: { type: Schema.Types.ObjectId, ref: "user", required: true },
        message: { type: Schema.Types.ObjectId, ref: "message", required: true },
        read: { type: Boolean, default: false }
    }
);

module.exports = mongoose.model("notification", notificationSchema);