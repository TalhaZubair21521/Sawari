const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdSchema = new Schema({
    id: Schema.ObjectId,
    hiringType: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    sellerType: { type: String, required: true },
    color: { type: String, required: true },
    priceValue: { type: Number, required: true },
    priceCurrency: { type: String, required: true },
    doors: { type: Number, required: true },
    millage: { type: Number, required: true },
    bodyType: { type: String, required: true },
    fuel: { type: String, required: true },
    seats: { type: Number, required: true },
    gear: { type: String, required: true },
    city: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: Number, required: true },
    engineType: { type: String, required: true },
    engineValue: { type: Number, required: true },
    sold: { type: Boolean, required: true },
    images: [{ type: String }],
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
}, { timestamps: true }
);

module.exports = mongoose.model("ad", AdSchema);