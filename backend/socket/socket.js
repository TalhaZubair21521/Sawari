const roomController = require("../controllers/room");
const Firebase = require("../firebase/firebase");
const connectionController = require("../controllers/connection");

const socketMiddlewares = require("./middlewares");

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
            } else {
                // Inside Individual Chat
                if (data.message.room === null) {
                    // Room Does Not Exists, Create Individual Room
                    const response = await roomController.Create_Individual_Room(data.room.users[0], data.room.users[1]);
                    console.log(response);


                    // //Other Thing is Same as Message Sent
                    // const roomDetails = await roomController.Get_Room(roomId);
                    // console.log("Room", roomDetails)
                    // // Message Saved
                    // const messageSaved = await roomController.Save_Message(data.message.author, data.message.room, data.message.text);
                    // console.log("Message Saved", messageSaved);
                    // // Get Connection Details of Sender and Reciever
                    // let recieverId = null;
                    // let senderId = null;
                    // if (roomDetails.users[0] == data.message.author) {
                    //     recieverId = roomDetails.users[1];
                    //     senderId = roomDetails.users[0];
                    // } else {
                    //     recieverId = roomDetails.users[0];
                    //     senderId = roomDetails.users[1];
                    // }
                    // const sender = await connectionController.getConnection(senderId);
                    // const reciever = await connectionController.getConnection(recieverId);
                    // console.log("sender :", sender);
                    // console.log("reciever :", reciever);
                    // // If has reciever connection, emit message, else send notification  
                    // // Send Message to Reciever
                    // // reciever
                    // if (reciever == null) {
                    //     console.log("User Not Connected with socket");
                    // } else {
                    //     console.log("User have an Socket")
                    //     console.log("Reciever Socket", reciever.socket)
                    //     io.to(reciever.socket).emit("messageRecieved", { received: true, message: messageSaved });
                    // }
                    // // sender
                    // console.log("Sender Socket  ", sender.socket)
                    // io.to(sender.socket).emit("messageSentAck", { sent: true, message: messageSaved });









                } else {
                    // Room ID Exist
                    const roomId = data.message.room;
                    const roomDetails = await roomController.Get_Room(roomId);
                    console.log("Room", roomDetails)
                    // Message Saved
                    const messageSaved = await roomController.Save_Message(data.message.author, data.message.room, data.message.text);
                    console.log("Message Saved", messageSaved);
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
                    const sender = await connectionController.getConnection(senderId);
                    const reciever = await connectionController.getConnection(recieverId);
                    console.log("sender :", sender);
                    console.log("reciever :", reciever);
                    // If has reciever connection, emit message, else send notification  
                    // Send Message to Reciever
                    // reciever
                    if (reciever == null) {
                        console.log("User Not Connected with socket");
                    } else {
                        console.log("User have an Socket")
                        console.log("Reciever Socket", reciever.socket)
                        io.to(reciever.socket).emit("messageRecieved", { received: true, message: messageSaved });
                    }
                    // sender
                    console.log("Sender Socket  ", sender.socket)
                    io.to(sender.socket).emit("messageSentAck", { sent: true, message: messageSaved });
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