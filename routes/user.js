const express = require("express");

const userHandler = require("../handlers/user");

const userControllers = require("../controllers/user");

const router = express.Router();

router.post("/signup", userHandler.userHandler, userControllers.Signup);
router.get("/signin", userControllers.Signin);

exports.routes = router;
