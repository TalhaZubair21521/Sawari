const express = require("express");

const postController = require("../controllers/post");

const router = express.Router();

router.post("/addPost", postController.AddPost);
router.get("/getPostsByUser", postController.GetPostByUser);
router.get("/GetPosts", postController.GetPosts);
router.put("/AddCommentToPost", postController.AddCommentToPost);
router.get("/getPost", postController.GetPost);

exports.routes = router;
