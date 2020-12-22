const Connection = require("../models/connection");
const socket = require("../socket/socket");

exports.createConnection = async (userId, socketId) => {
    try {
        const connection = new Connection({ user: userId, socket: socketId });
        const result = await Connection.find({ user: userId });
        if (result.length === 0) {
            await connection.save();
        } else {
            await Connection.findOneAndUpdate({ user: socket.userDetails._id }, { $set: { socket: socket.id } });
        }
    } catch (error) {
        return false;
    }
};

exports.deleteConnection = async (userId) => {
    try {
        await Connection.findOneAndDelete({ user: userId });
    } catch (error) {
        return false;
    }
};

exports.getConnection = async (userId) => {
    try {
        const docs = await Connection.findOne({ user: userId });
        return docs;
    } catch (error) {
        return false;
    }
};