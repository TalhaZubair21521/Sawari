const express = require("express");

const carControllers = require("../controllers/car");

// const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.get("/addCars", carControllers.AddCars);
router.get("/getMakes", carControllers.GetMakes);
router.get("/getModelsByMake", carControllers.GetModelsByMake);

exports.routes = router;
