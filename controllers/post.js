const Post = require("../models/post");

exports.AddPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        post.save((err, result) => {
            if (!err) {
                res.status(200).json({ "type": "success", "result": "Post Added Successfully" });
                return;
            }
            res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
        });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetPosts = async (req, res) => {
    try {
        const posts = await Post.find({}, 'user images text').populate('user', 'name image');
        res.status(200).json({ "type": "success", "result": posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetPost = async (req, res) => {
    try {
        const post = await Post.findById(req.query.postID, 'comments').populate('comments.user', 'name image');
        res.status(200).json({ "type": "success", "result": post });
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

exports.AddCommentToPost = async (req, res) => {
    try {
        const postID = req.body.postID;
        const response = await Post.findByIdAndUpdate(postID, { $push: { comments: [{ body: req.body.comment, user: req.body.commentBy }] } })
        if (!response) {
            res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
            return;
        }
        res.status(200).json({ "type": "success", "result": "Comment Added Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}