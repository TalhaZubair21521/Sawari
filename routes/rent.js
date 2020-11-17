const express = require("express");

const rentHandler = require("../handlers/rent");

const rentControllers = require("../controllers/rent");

const rentImagesMiddleware = require("../middlewares/ImagesMiddleware");

const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertRent", rentImagesMiddleware.upload.array('images'), authenticator.athenticate, rentHandler.rentHandler, rentControllers.InsertRent);
router.get("/getRentByUser", authenticator.athenticate, rentControllers.GetRentsByUser);
router.get("/getAllRent", authenticator.athenticate, rentControllers.GetAllRents);
router.post("/getFilteredRent", authenticator.athenticate, rentControllers.GetFilteredRents);
router.get("/getRent", authenticator.athenticate, rentControllers.GetRent);

exports.routes = router;