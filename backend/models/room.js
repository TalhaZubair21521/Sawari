const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        id: Schema.ObjectId,
        group: { type: Boolean, default: false },
        name: { type: String, default: null, index: true },
        users: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    },
    { timestamps: true },
    { toJSON: { virtuals: true } },
    { toObject: { virtuals: true } }
);

module.exports = mongoose.model("room", RoomSchema);