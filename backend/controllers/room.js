const Room = require("../models/room");
const Message = require("../models/message");

exports.is_Individual_Room_Already_Exist = async (user1, user2) => {
    try {
        const response = await Room.find({ users: { $all: [user1, user2] } })
        if (response.length === 0) {
            return null;
        } else {
            return response;
        }
    } catch (error) {
        return false;
    }
};
exports.GetRoomDetails = async (req, res) => {
    try {
        const userId = req.query.userId;
        const otherUserId = req.query.otherUserId;
        const response = await this.is_Individual_Room_Already_Exist(userId, otherUserId);
        res.status(200).json({ type: "success", result: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
}

exports.Create_Individual_Room = async (user1, user2) => {
    try {
        const room = new Room({ users: [user1, user2] });
        const response = await room.save();
        return response;
    } catch (error) {
        return false;
    }
};

exports.is_Group_Room_Already_Exist = async (groupName) => {
    try {
        const room = await Room.find({ name: groupName });
        console.log(room);
    } catch (error) {
        return false;
    }
};

exports.is_User_In_Room_Already_Exist = async (userID) => {
    try {
        const room = await Room.find({ users: userID });
        console.log(room);
    } catch (error) {
        return false;
    }
};

exports.Create_Group_Room = async (userID, groupName) => {
    try {
        const room = new Room({ users: [userID], group: true, name: groupName });
        console.log(room);
    } catch (error) {
        return false;
    }
}

exports.Add_User_To_Room = async (roomID, userID) => {
    try {
        const response = await Room.findByIdAndUpdate(roomID, { $push: { users: [userID] } });
        console.log(response);
    } catch (error) {
        return false;
    }
}

exports.Get_Rooms = async (req, res) => {
    try {
        const userId = req.query.userId;
        const rooms = await Room.find({ users: userId }).populate('users', 'name image');
        res.status(200).json({ "type": "success", "result": rooms });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
};

exports.Save_Message = async (userID, roomID, text) => {
    try {
        const message = new Message({ author: userID, room: roomID, text: text, attachments: [] });
        await message.save();
        const newresponse = await Message.findById(message._id).populate('author', 'image');
        return newresponse;
    } catch (error) {
        console.log(error);
        return false;
        // res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
};

exports.GetMessagesOfRoom = async (req, res) => {
    try {
        const roomID = req.query.roomId;
        const messages = await Message.find({ room: roomID }).populate("author", 'image').sort([["createdAt", -1]]);
        res.status(200).json({ "type": "success", "result": messages });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.Get_Room = async (roomID) => {
    try {
        const room = await Room.findById(roomID);
        return room;
    } catch (error) {
        return false;
    }
}

exports.JoinGroup = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}