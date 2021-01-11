const express = require("express");

const roomControllers = require("../controllers/room");

const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/joinGroup", authenticator.athenticate, roomControllers.JoinGroup);
router.get("/getRooms", roomControllers.Get_Rooms);
router.get("/getRoom", authenticator.athenticate, roomControllers.GetMessagesOfRoom);
router.get("/checkRoom", authenticator.athenticate, roomControllers.GetRoomDetails);

exports.routes = router;