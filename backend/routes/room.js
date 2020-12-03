const express = require("express");

const roomController = require("../controllers/room");

const router = express.Router();

router.post("/createRoom", roomController.CreateRoom);
router.post("/joinRoom", roomController.JoinRoom);
router.post("/saveMessage", roomController.SaveMessage);
router.get("/getChat", roomController.GetRoom);
router.get("/getChats", roomController.GetRooms);

exports.routes = router;