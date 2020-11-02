const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RentSchema = new Schema({
    id: Schema.ObjectId,
    location: { type: String, unique: true },
    make: { type: String, required: true },
    fuelType: { type: String, required: true },
    fearBox: { type: Object, required: true },
    trade: { type: String, required: true },
    mode: { type: String, required: true },
    year: { type: String, required: true },
    bodyType: { type: String, required: true },
    seats: { type: String, required: true },
    colour: { type: String, required: true },
    picture: { type: String, required: true },
    description: { type: String, required: true },
    insurance: { type: String, required: true },
    min: { type: String, required: true },
    max: { type: String, required: true },
}, { timestamps: true }
);

module.exports = mongoose.model("rent", RentSchema);