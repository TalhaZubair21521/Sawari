const express = require("express");

const notificationsController = require("../controllers/notifications");

const router = express.Router();

router.get("/getNotifcationsByUser", notificationsController.GetNotifications);

exports.routes = router;
