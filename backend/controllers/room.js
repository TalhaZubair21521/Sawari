const Room = require("../models/room");
const Message = require("../models/message");

exports.CreateRoom = async (req, res) => {
    try {
        res.status(200).json({ type: "success", result: "Room Created Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.JoinRoom = async (req, res) => {
    try {
        res.status(200).json({ type: "success", result: "Join Room Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.SaveMessage = async (req, res) => {
    try {
        res.status(200).json({ type: "success", result: "Save Message Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetRoom = async (req, res) => {
    try {
        res.status(200).json({ type: "success", result: "Get Room Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetRooms = async (req, res) => {
    try {
        res.status(200).json({ type: "success", result: "Get Rooms Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}