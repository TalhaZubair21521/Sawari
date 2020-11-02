const express = require("express");

const rentOutHandler = require("../handlers/rentOut");

const rentOutControllers = require("../controllers/rentOut");

const rentOutImagesMiddleware = require("../middlewares/ImagesMiddleware");
const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertRentOut", rentOutImagesMiddleware.upload.array('images'), authenticator.athenticate, rentOutHandler.rentOutHandler, rentOutControllers.InsertRentOut);

exports.routes = router;
