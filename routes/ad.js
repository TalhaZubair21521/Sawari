const express = require("express");

const adHandler = require("../handlers/ad");

const adControllers = require("../controllers/ad");

const adMiddleware = require("../middlewares/adImagesMiddleware");
const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertAd", adMiddleware.upload.array('images'), authenticator.athenticate, adHandler.adHandler, adControllers.InsertAd);

exports.routes = router;
