const express = require("express");

const adHandler = require("../handlers/ad");

const adControllers = require("../controllers/ad");

const adImagesMiddleware = require("../middlewares/ImagesMiddleware");

const authenticator = require("../middlewares/authenticator");

const router = express.Router();

router.post("/insertAd", adImagesMiddleware.upload.array('images'), authenticator.athenticate, adHandler.adHandler, adControllers.InsertAd);
router.put("/updateAd", adImagesMiddleware.upload.array('images'), authenticator.athenticate, adHandler.adHandler, adControllers.UpdateAd);
router.get("/getAdsByUser", authenticator.athenticate, adControllers.GetAdsByUser);
router.get("/getAllads", authenticator.athenticate, adControllers.GetAllAds);
router.post("/getFilteredAds", authenticator.athenticate, adControllers.FilterAds);
router.put("/changeSoldStatus", authenticator.athenticate, adControllers.ChangeSoldStatus);
router.get("/getAd", authenticator.athenticate, adControllers.GetAd);
router.post("/makeFavourite", authenticator.athenticate, adControllers.MakeFavourite);
router.post("/removeFavourite", authenticator.athenticate, adControllers.RemoveFavourite);
router.get("/getFavouritedAds", authenticator.athenticate, adControllers.GetFavouriteAds);

exports.routes = router;