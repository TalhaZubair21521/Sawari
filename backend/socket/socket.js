const RoomController = require("../controllers/room");

const connections = new Map();

// Create Room
// Room connects with Multiple Users ( Possibly Array )

module.exports = async (io) => {

    // Authentication Middleware
    io.use((socket, next) => {
        console.log("Socket Middleware");
        next();
    });

    //User Information From Database
    io.use((socket, next) => {
        console.log("User Information Taken");
        next();
    });

    // On Connection
    io.on('connection', (socket) => {
        socket.userId = socket.handshake.query.userId
        connections.set(socket.handshake.query.userId, socket.id);
        console.log("Connected");
        console.log(connections);

        // on Recieving Message
        socket.on("sendMessage", async (data) => {

        });

        // On Disconnection
        socket.on("disconnect", async (data) => {
            connections.delete(userId)
            console.log("Disconnected");
            console.log(connections);
        });

    });
}