const mongoose = require("mongoose");
const user = require("./user");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        id: Schema.ObjectId,
        text: { type: String, required: true },
        images: [{ type: String, required: true }],
        user: { type: Schema.Types.ObjectId, ref: "user", required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);