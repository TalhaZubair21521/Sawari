const express = require("express");
const Firebase = require("../firebase/firebase");

const router = express.Router();

router.post("/sendNotifcation", async (req, res) => {
    const response = await Firebase.SendNotification();
    res.send(response);
});

router.post("/generateDynamicLink", async (req, res) => {
    const response = await Firebase.CreateDynamicLink();
    res.send(response);
});

exports.routes = router;