const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReplySchema = new Schema(
    {
        text: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        timestamps: { type: Date, default: Date.now }
    },
    { _id: false }
);

const CommentSchema = new Schema(
    {
        id: Schema.ObjectId,
        post: { type: Schema.Types.ObjectId, ref: "post", required: true },
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        text: { type: String, required: true },
        replies: [ReplySchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("comment", CommentSchema);