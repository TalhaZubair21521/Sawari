const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdSchema = new Schema({
    id: Schema.ObjectId,
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    doors: { type: Number, required: true },
    millage: { type: Number, required: true },
    minSeats: { type: Number, required: true },
    maxSeats: { type: Number, required: true },
    bodyType: { type: String, required: true },
    fuel: { type: String, required: true },
    gear: { type: String, required: true },
    engine: { type: String, required: true },
    images: [{ type: String }],
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
}, { timestamps: true }
);

module.exports = mongoose.model("ad", AdSchema);