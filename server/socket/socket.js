const roomController = require("../controllers/room");
const Firebase = require("../firebase/firebase");
const connectionController = require("../controllers/connection");
const User = require("../models/user");
const Message = require("../models/message");
const socketMiddlewares = require("./middlewares");
const notifications = require("../models/notifications");

module.exports = (io) => {
    io.use(socketMiddlewares.isAuthorized);
    io.use(socketMiddlewares.getUserDetails);
    io.on('connection', async (socket) => {
        setInterval(() => {
            io.to(socket.id).emit("sda", {});
        }, 4000);
        await connectionController.createConnection(socket.userDetails._id, socket.id);
        socket.on("sendMessage", async (data) => {
            // console.log(data);
            if (data.room.group) {
                // console.log("Data from User", data);
                //Gett the room details
                const room = await roomController.Get_Group_Room_Detail();
                // console.log("Room Details", room);
                //Save the message in database
                const message = new Message({ ...data.message, room: room._id });
                // console.log("Message", message);
                let messageSaved = await message.save();
                messageSaved = await Message.findById(messageSaved._id).populate("author");
                //send the acknowledgement to user
                const senderId = message.author;
                const sender = await connectionController.getConnection(senderId);
                // console.log("Connection", sender);
                // if (sender) {
                io.to(sender.socket).emit("messageSentAck", { sent: true, message: messageSaved, group: true });
                // }
                //send notification to all group members
                let users = room.users;
                users.map(async (item) => {
                    if (item + "" === "" + message.author) {
                        // const reciever = await connectionController.getConnection(item);
                        // io.to(reciever.socket).emit("messageRecieved", { received: true, message: messageSaved, group: true });
                    } else {
                        const reciever = await connectionController.getConnection(item);
                        if (reciever) {
                            io.to(reciever.socket).emit("messageRecieved", { received: true, message: messageSaved, group: true });
                            const user = await User.findById(item);
                            await Firebase.SendNotification("Message from " + messageSaved.author.name, messageSaved.text, user.fcmToken);
                        }
                    }
                });
            } else {
                // Inside Individual Chat
                console.log(data);
                if (data.message.room === null) {
                    // Room Does Not Exists, Create Individual Room
                    const isExist = await roomController.is_Individual_Room_Already_Exist(data.room.users[0], data.room.users[1]);
                    if (isExist === null) {
                        // console.log("Room Not Exist");
                    } else {
                        // console.log("Room Already Exists");
                    }
                    const response = await roomController.Create_Individual_Room(data.room.users[0], data.room.users[1]);
                    // console.log(response);
                    if (response) {
                        const roomId = response._id
                        // Other Thing is Same as Message Sent
                        const roomDetails = await roomController.Get_Room(roomId);
                        console.log("Room", roomDetails)
                        // Message Saved
                        const messageSaved = await roomController.Save_Message(data.message.author, roomId, data.message.text);
                        // console.log("Message Saved", messageSaved);
                        if (messageSaved) {
                            // Get Connection Details of Sender and Reciever
                            let recieverId = null;
                            let senderId = null;
                            if (roomDetails.users[0] == data.message.author) {
                                recieverId = roomDetails.users[1];
                                senderId = roomDetails.users[0];
                            } else {
                                recieverId = roomDetails.users[0];
                                senderId = roomDetails.users[1];
                            }
                            const fcmTOKEN_User = await User.findById(recieverId, 'fcmToken');
                            const Sender_User = await User.findById(senderId, 'name');

                            const sender = await connectionController.getConnection(senderId);
                            const reciever = await connectionController.getConnection(recieverId);
                            // console.log("sender :", sender);
                            // console.log("reciever :", reciever);
                            // If has reciever connection, emit message, else send notification  
                            // Send Message to Reciever
                            // reciever
                            if (reciever == null) {
                                await Firebase.SendNotification("Message from " + Sender_User.name, data.message.text, fcmTOKEN_User.fcmToken);
                                // console.log("User Not Connected with socket");
                            } else {
                                // console.log("User have an Socket")
                                // console.log("Reciever Socket", reciever.socket)
                                io.to(reciever.socket).emit("messageRecieved", { received: true, message: messageSaved });
                            }
                            // sender
                            // console.log("Sender Socket  ", sender.socket)
                            io.to(sender.socket).emit("messageSentAck", { sent: true, message: messageSaved });
                        } else {
                            // console.log("Reached Here");
                            io.to(sender.socket).emit("messageSentAck", { sent: false, message: messageSaved });
                        }
                    }
                } else {
                    // Room ID Exist
                    const roomId = data.message.room;
                    const roomDetails = await roomController.Get_Room(roomId);
                    // console.log("Room", roomDetails)
                    // Message Saved
                    const messageSaved = await roomController.Save_Message(data.message.author, data.message.room, data.message.text);
                    // console.log("Message Saved", messageSaved);

                    if (messageSaved) {
                        // Get Connection Details of Sender and Reciever
                        let recieverId = null;
                        let senderId = null;
                        if (roomDetails.users[0] == data.message.author) {
                            recieverId = roomDetails.users[1];
                            senderId = roomDetails.users[0];
                        } else {
                            recieverId = roomDetails.users[0];
                            senderId = roomDetails.users[1];
                        }
                        const fcmTOKEN_User = await User.findById(recieverId, 'fcmToken');
                        const Sender_User = await User.findById(senderId, 'name');

                        const sender = await connectionController.getConnection(senderId);
                        const reciever = await connectionController.getConnection(recieverId);
                        // console.log("sender :", sender);
                        // console.log("reciever :", reciever);
                        // If has reciever connection, emit message, else send notification  
                        // Send Message to Reciever
                        // reciever
                        if (reciever == null) {
                            // console.log("Message Id : " + messageSaved._id);
                            // console.log("User Id : " + Sender_User._id);
                            // console.log("Room Id : " + roomId);
                            const object = {
                                message: messageSaved._id,
                                user: Sender_User._id,
                                reciever: recieverId,
                                room: roomId
                            }
                            const notify = await notifications(object);
                            await notify.save();
                            await Firebase.SendNotification("Message from " + Sender_User.name, data.message.text, fcmTOKEN_User.fcmToken);
                            // console.log("User Not Connected with socket");
                        } else {
                            // console.log("User have an Socket")
                            // console.log("Reciever Socket", reciever.socket)
                            io.to(reciever.socket).emit("messageRecieved", { received: true, message: messageSaved });
                        }
                        // sender
                        // console.log("Sender Socket  ", sender.socket)
                        if (sender) {
                            io.to(sender.socket).emit("messageSentAck", { sent: true, message: messageSaved });
                        }
                    } else {
                        // console.log("Reached Here");
                        io.to(sender.socket).emit("messageSentAck", { sent: true, message: messageSaved });
                    }
                }
            }
            /*
                Get Data From Frontend in the Following Format
                data = {
                    room:
                        {
                            group : true/false,
                            name : "Name of Group If Group Otherwise Null",
                            users : [user ids]    // Your ID and Other User ID .......... if Group Only Your ID
                        },
                    message:{
                            author: "your user Id",
                            room: "If room exists send room ID other wise send null",
                            text: "Message Itself",
                            attachments: [files(images) in Base 64]
                    }    
                }
                Logic
                if(isGroup){
                     if(message.room===null){
                         // Check if Room Exist with such Name
                         
                         // Create Group Room With room.name
                         // Save Message

                         // If Exist Send to User With Socket
                         // Send Notification

                     }else{
                         // Save Message

                         // If Exist Send to User With Socket
                         // Send Notification
                     }
                }else{
                    if(message.room===null){
                        // Create Individual Room with users Array
                        // Save Message
                        
                        // If user Exist in connection, Send to User With Socket otherwise send notifcation
                    }else{
                        // Save Message
                        // If user Exist in connection, Send to User With Socket otherwise send notifcation
                    }
                }
            */
        });

        socket.on("disconnect", async (data) => {
            await connectionController.deleteConnection(socket.userDetails._id);
        });
    });
}