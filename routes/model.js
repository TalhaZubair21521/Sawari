const express = require("express");

const modelControllers = require("../controllers/model");

const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/addMakes",
    // authenticator.athenticate, 
    modelControllers.AddMake);
router.get("/getMakes", authenticator.athenticate, modelControllers.GetMakes);

exports.routes = router;
