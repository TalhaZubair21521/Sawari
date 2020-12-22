const User = require("../../models/user");

exports.getUserDetails = async (socket, next) => {
    if (socket.handshake.query.userId.match(/^[0-9a-fA-F]{24}$/)) {
        const user = await User.findById(socket.handshake.query.userId, 'email name phone');
        if (!user) {
            next(new Error("No Such User Exists"));
        }
        socket.userDetails = user;
        next();
    } else {
        next(new Error("No Such User Exists"));
    }

}