const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        id: Schema.ObjectId,
        author: { type: Schema.Types.ObjectId, ref: "user", required: true },
        room: { type: Schema.Types.ObjectId, ref: "room", required: true },
        text: { type: String, required: true },
        read: { type: Boolean, default: false },
        attachments: [{ type: String, required: true }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);