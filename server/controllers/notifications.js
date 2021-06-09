const Notification = require("../models/notifications");

exports.GetNotifications = async (req, res) => {
    try {
        const userId = req.query.userId;
        const notifications = await Notification.find({ reciever: userId }).populate("message", "text createdAt").populate("room", "_id").populate("user", "name image").populate("reciever", "name image");
        res.status(200).json({ "type": "success", "result": notifications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}