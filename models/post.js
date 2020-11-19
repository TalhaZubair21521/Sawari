const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        body: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "user", required: true }
    },
    { _id: false }
);

const PostSchema = new Schema(
    {
        id: Schema.ObjectId,
        text: { type: String, required: true },
        images: [{ type: String, required: true }],
        comments: [CommentSchema],
        user: { type: Schema.Types.ObjectId, ref: "user", required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);