const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
    id: Schema.ObjectId,
    names: [{ type: String, required: true }],
}, { timestamps: true }
);

module.exports = mongoose.model("model", ModelSchema);