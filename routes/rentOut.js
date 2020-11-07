const express = require("express");

const rentOutHandler = require("../handlers/rentOut");

const rentOutControllers = require("../controllers/rentOut");

const rentOutImagesMiddleware = require("../middlewares/ImagesMiddleware");

const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertRentOut", rentOutImagesMiddleware.upload.array('images'), authenticator.athenticate, rentOutHandler.rentOutHandler, rentOutControllers.InsertRentOut);
router.get("/getRentOutByUser", authenticator.athenticate, rentOutControllers.GetRentOutByUser);
router.get("/getAllRentOut", authenticator.athenticate, rentOutControllers.GetAllRentOuts);
router.post("/getFilteredRentOut", authenticator.athenticate, rentOutControllers.GetFilteredRentOuts);
router.get("/deleteRentOut", authenticator.athenticate, rentOutControllers.DeleteRentOut);
router.get("/getRentOut", authenticator.athenticate, rentOutControllers.GetRentOut);

exports.routes = router;