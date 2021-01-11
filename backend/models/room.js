const mongoose = require("mongoose");
const MongooseLeanVirtuals = require('mongoose-lean-virtuals');
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        id: Schema.ObjectId,
        group: { type: Boolean, default: false },
        name: { type: String, default: null, index: true },
        users: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    },
    { timestamps: true },
    { toJSON: { virtuals: true } },
    { toObject: { virtuals: true } }
);

RoomSchema.virtual('lastMessage').get(async function () {
    const result = await mongoose.model('message').find({ room: this._id }, 'createdAt text').sort([["createdAt", -1]]).limit(1);
    this.lastMessage = result[0];
    return this;
});

RoomSchema.plugin(MongooseLeanVirtuals);
module.exports = mongoose.model("room", RoomSchema);