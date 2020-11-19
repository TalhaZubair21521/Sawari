const Room = require("../models/room");
const Message = require("../models/message");

exports.CreateRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        console.log(room);
        res.status(200).json({ type: "success", result: "Room Created Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}