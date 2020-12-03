const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    id: Schema.ObjectId,
    email: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    image: { type: String, trim: true },
    password: { type: String, required: true },
    provider: { type: Object },
    forgetKey: { type: String, required: true },
}, { timestamps: true }
);

UserSchema.statics.ConvertToHash = async (password) => {
    return bcrypt.hashSync(password, 10);
};

UserSchema.statics.isPasswordEqual = async (password, passwordFromDatabase) => {
    return bcrypt.compare(password, passwordFromDatabase);
};

module.exports = mongoose.model("user", UserSchema);