const express = require("express");

const modelControllers = require("../controllers/model");

const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/addModels", authenticator.athenticate, modelControllers.AddModels);
router.get("/getModels", authenticator.athenticate, modelControllers.GetModels);

exports.routes = router;
