const express = require("express");

const adHandler = require("../handlers/ad");

const adControllers = require("../controllers/ad");

const adMiddleware = require("../middlewares/adImagesMiddleware");
const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertAd", adMiddleware.upload.array('images'), authenticator.athenticate, adHandler.adHandler, adControllers.InsertAd);
router.get("/getAdsByUser", authenticator.athenticate, adControllers.GetAdsByUser);
router.get("/getAllads", authenticator.athenticate, adControllers.GetAllAds);
router.get("/getFilteredAds", authenticator.athenticate, adControllers.FilterAds);
router.get("/getAd", authenticator.athenticate, adControllers.GetAd);

exports.routes = router;
