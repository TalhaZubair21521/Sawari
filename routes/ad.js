const express = require("express");

const adHandler = require("../handlers/ad");

const adControllers = require("../controllers/ad");

const adImagesMiddleware = require("../middlewares/ImagesMiddleware");
const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertAd", adImagesMiddleware.upload.array('images'), authenticator.athenticate, adHandler.adHandler, adControllers.InsertAd);
router.get("/getAdsByUser", authenticator.athenticate, adControllers.GetAdsByUser);
router.get("/getAllads", authenticator.athenticate, adControllers.GetAllAds);
router.post("/getFilteredAds", authenticator.athenticate, adControllers.FilterAds);
router.get("/getAd", authenticator.athenticate, adControllers.GetAd);

exports.routes = router;
