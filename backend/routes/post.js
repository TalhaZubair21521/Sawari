const express = require("express");

const postController = require("../controllers/post");
const imagesMiddleware = require("../middlewares/ImagesMiddleware");
const router = express.Router();

const authenticator = require("../middlewares/authenticator");

router.post("/addPost", authenticator.athenticate, imagesMiddleware.upload.array('images'), postController.AddPost);
router.get("/getPostsByUser", authenticator.athenticate, postController.GetPostByUser);
router.get("/GetPosts", authenticator.athenticate, postController.GetPosts);
router.post("/addComment", authenticator.athenticate, postController.AddComment);
router.put("/addReply", authenticator.athenticate, postController.AddReply);
router.get("/getComments", authenticator.athenticate, postController.GetComments);

router.get("/posts", postController.getPostsPaginated);

exports.routes = router;