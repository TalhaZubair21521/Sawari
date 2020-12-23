// const roomController = require("../controllers/room");
// const Firebase = require("../firebase/firebase");
const connectionController = require("../controllers/connection");

const socketMiddlewares = require("./middlewares");

module.exports = async (io) => {
    io.use(socketMiddlewares.isAuthorized);
    io.use(socketMiddlewares.getUserDetails);
    io.on('connection', async (socket) => {
        await connectionController.createConnection(socket.userDetails._id, socket.id);
        socket.on("sendMessage", async (data) => {
            /*
                Get Data From Frontend in the Following Format
                data = {
                    room:
                        {
                            group : true/false,
                            name : "Name of Group If Group Otherwise Null",
                            users : [user ids]    // Your ID and Other User ID .......... if Group otherwise Only Your ID
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
                        
                        // If Exist Send to User With Socket
                        // Send Notification
                    }else{
                        // Save Message
                        // If Exist Send to User With Socket
                        // Send Notification
                    }
                }
            */
        });
        socket.on("disconnect", async (data) => {
            await connectionController.deleteConnection(socket.userDetails._id);
        });
    });
}