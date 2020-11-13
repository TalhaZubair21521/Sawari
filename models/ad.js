const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdSchema = new Schema({
    id: Schema.ObjectId,
    hiringType: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    sellerType: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    priceValue: { type: Number, required: true, trim: true },
    priceCurrency: { type: String, required: true, trim: true },
    doors: { type: Number, required: true, trim: true },
    millage: { type: Number, required: true, trim: true },
    bodyType: { type: String, required: true, trim: true },
    fuel: { type: String, required: true, trim: true },
    seats: { type: Number, required: true, trim: true },
    gear: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    engineType: { type: String, required: true, trim: true },
    engineValue: { type: Number, required: true, trim: true },
    sold: { type: Boolean, required: true, trim: true },
    images: [{ type: String, trim: true }],
    latitude: { type: String, required: true, trim: true },
    longitude: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
}, { timestamps: true }
);

module.exports = mongoose.model("ad", AdSchema);