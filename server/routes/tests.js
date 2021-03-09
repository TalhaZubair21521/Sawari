const express = require("express");
const Firebase = require("../firebase/firebase");
const Room = require("../models/room");

const router = express.Router();

router.post("/sendNotifcation", async (req, res) => {
    const response = await Firebase.SendNotification();
    res.send(response);
});

router.post("/generateDynamicLink", async (req, res) => {
    const response = await Firebase.CreateDynamicLink();
    res.send(response);
});

router.post("/createRoom", async (req, res) => {
    try {
        var data = {
            users: ["5fe9698757bee40f2c6b6b9d", "5fe9a65d4f5593149032df7e"]
        }
        const room = new Room(data);
        const response = await room.save();
        console.log(response);
        res.send("Saved");
    } catch (error) {
        res.send(error);
    }
});

exports.routes = router;