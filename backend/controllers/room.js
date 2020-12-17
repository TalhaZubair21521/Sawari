const Room = require("../models/room");
const Message = require("../models/message");

exports.is_Individual_Room_Already_Exist = async (user1, user2) => {
    try {
        const response = await Room.find({ users: { $all: [user1, user2] } })
        console.log(response);
        return true;
    } catch (error) {
        return false;
    }
};

exports.Create_Individual_Room = async (user1, user2) => {
    try {
        const room = new Room({ users: [user1, user2] });
        console.log(room);
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

exports.Get_Rooms = async (userID) => {
    try {
        const rooms = await Room.find({ users: userID });
        console.log(rooms);
    } catch (error) {
        return false;
    }
};


exports.Save_Message = async (userID, roomID, text) => {
    try {
        const message = new Message({ author: userID, room: roomID, text: text, attachments: [] });
        console.log(message);
    } catch (error) {
        return false;
    }
};

exports.Get_Room = async (roomID) => {
    try {
        const messages = await Message.find({ room: roomID });
        console.log(messages);
    } catch (error) {
        return false;
    }
}