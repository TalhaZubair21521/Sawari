const express = require("express");

const chatController = require("../controllers/chat");

const router = express.Router();

router.post("/createRoom", chatController.CreateRoom);

exports.routes = router;
