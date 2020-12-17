const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        id: Schema.ObjectId,
        group: { type: Boolean, required: false },
        name: { type: String, default: null },
        users: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("room", RoomSchema);