const Room = require("../models/room");
const Message = require("../models/message");
const roomController = require("../controllers/room");

exports.is_Individual_Room_Already_Exist = async (user1, user2) => {
    try {
        const response = await Room.find({ users: { $all: [user1, user2] }, group:false })
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
        if (room.length === 0) {
            return false;
        }
        return true;
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

exports.Create_Group_Room = async (groupName) => {
    try {
        const room = new Room({ users: [], group: true, name: groupName });
        await room.save();
        return true;
    } catch (error) {
        return false;
    }
}

exports.Get_Group_Room_Detail = async () => {
    try {
        const room = await Room.find({ name: "global" });
        return room[0];
    } catch (error) {
        return false;
    }
}

exports.Add_User_To_Room = async (roomID, userID) => {
    try {
        const response = await Room.findByIdAndUpdate(roomID, { $push: { users: [userID] } });
    } catch (error) {
        return false;
    }
}

exports.Get_Rooms = async (req, res) => {
    try {
        const userId = req.query.userId;
        const rooms = await Room.find({ users: userId, group: false }).populate('users', 'name image').sort([["lastMessage.createdAt", -1]]).lean({ virtuals: true });
        if (rooms.length > 0) {
            await rooms[0].lastMessage;
            rooms.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
        }
        res.status(200).json({ "type": "success", "result": rooms });
    } catch (error) {
        console.log(error)
        res.status(500).json({ "type": "failure", "result": "Server Not Responding", error: error });
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
        console.log(messages);
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


exports.GetGroupMessages = async (req, res) => {
    try {
        const room = await roomController.Get_Group_Room_Detail();
        // const users = ["60c04b67e614fa0808ff10cc", "60c05166e614fa0808ff10d0", "60c1e664ae82263a508ae263", "60cb209f647ea03ec051bee0", "60e6913a3ba66f1e1c9468e9", "60e69178d5fc493598f92b48"];
        // const response = await Room.findByIdAndUpdate(room._id, { $push: { users: users } });
        // for (let i = 0; i < 20; i++) {
        //     const randomNumber = Math.floor(Math.random() * 6);
        //     const userId = users[randomNumber];
        //     const message = new Message({ author: userId, room: room._id, text: "New Message", attachments: [] });
        //     await message.save();
        // }
        // const message = new Message({ author: room.users[0], room: room._id, text: "New Message", attachments: [] });
        // await message.save();
        const messages = await Message.find({ room: room._id }, '-attachments -read -updatedAt -__v').populate("author", "_id image").sort([["createdAt", -1]]);
        res.status(200).json({ "type": "success", "result": messages });
    } catch (error) {
        console.log(error)
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}
