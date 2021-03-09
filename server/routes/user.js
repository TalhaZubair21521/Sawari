const express = require("express");

const userHandler = require("../handlers/user");

const userControllers = require("../controllers/user");

const authenticator = require("../middlewares/authenticator");

const imageMiddleware = require("../middlewares/profileImageMiddleware");

const router = express.Router();

router.post("/signup", userHandler.userHandler, userControllers.Signup);
router.get("/signin", userControllers.Signin);
router.get("/oAuthGoogle", userControllers.OauthGoogle);
router.get("/oAuthFacebook", userControllers.OauthFacebook);
router.put("/updateProfile", authenticator.athenticate, imageMiddleware.upload.single("image"), userControllers.UpdateProfile);


exports.routes = router;