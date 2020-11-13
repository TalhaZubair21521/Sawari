const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MakeSchema = new Schema({
    id: Schema.ObjectId,
    names: [{ type: String, required: true }],
}, { timestamps: true }
);

module.exports = mongoose.model("make", MakeSchema);