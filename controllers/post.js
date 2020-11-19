const Post = require("../models/post");

exports.AddPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        const response = await post.save();
        if (!response) {
            console.log("Adding Post Error :", response);
            // Delete Image
            res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
            return;
        }
        res.status(200).json({ "type": "success", "result": "Post Added Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ "type": "success", "result": posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetPostByUser = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.query.userID });
        res.status(200).json({ "type": "success", "result": posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}