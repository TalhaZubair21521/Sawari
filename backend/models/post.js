const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FileSchema = new Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true }
    },
    { _id: false }
);

const PostSchema = new Schema(
    {
        id: Schema.ObjectId,
        text: { type: String, required: true },
        media: [FileSchema],
        user: { type: Schema.Types.ObjectId, ref: "user", required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);