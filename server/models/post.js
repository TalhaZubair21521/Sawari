const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")
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
        text: { type: String, default: "" },
        media: [FileSchema],
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: "user", required: true }]
    },
    { timestamps: true }
);

PostSchema.virtual('details').get(function () {
    return this.email + ' , ' + this.name;
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("post", PostSchema);
// .lean({ virtuals: true });