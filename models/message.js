const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        id: Schema.ObjectId,
        author: { type: Schema.Types.ObjectId, ref: "user", required: true },
        room: { type: Schema.Types.ObjectId, ref: "room", required: true },
        body: { type: String, required: true },
        attachments: [{ type: String, required: true }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);