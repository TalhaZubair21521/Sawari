const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarSchema = new Schema({
    id: Schema.ObjectId,
    make: { type: String, required: true },
    model: { type: String, required: true },
});

module.exports = mongoose.model("car", CarSchema);