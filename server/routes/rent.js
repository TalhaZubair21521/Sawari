const express = require("express");

const rentHandler = require("../handlers/rent");

const rentControllers = require("../controllers/rent");

const rentImagesMiddleware = require("../middlewares/ImagesMiddleware");

const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertRent", rentImagesMiddleware.upload.array('images'), authenticator.athenticate, rentHandler.rentHandler, rentControllers.InsertRent);
router.put("/updateRent", rentImagesMiddleware.upload.array('images'), authenticator.athenticate, rentHandler.rentHandler, rentControllers.UpdateRent);
router.get("/getRentByUser", authenticator.athenticate, rentControllers.GetRentsByUser);
router.get("/getAllRent", authenticator.athenticate, rentControllers.GetAllRents);
router.post("/getFilteredRent", authenticator.athenticate, rentControllers.GetFilteredRents);
router.put("/changeRentOutStatus", authenticator.athenticate, rentControllers.ChangeRentOutedStatus);
router.get("/getRent", authenticator.athenticate, rentControllers.GetRent);
router.post("/makeFavourite", authenticator.athenticate, rentControllers.MakeFavourite);
router.post("/removeFavourite", authenticator.athenticate, rentControllers.RemoveFavourite);

exports.routes = router;