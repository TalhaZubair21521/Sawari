const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

const Remover = require("./functions/imageResizer");

exports.AddPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        const user = await User.findById(post.user);
        if (!user) {
            await Remover.RemoveImages(req.files);
            res.status(500).json({ "type": "failure", "result": "User ID Not Exist" });
        } else {
            const filesArray = await Remover.ResizeImages("posts/" + post._id, req.files);
            const updatedArray = filesArray.map((file) => {
                return { type: "image", name: file }
            });
            post.media = updatedArray;
            post.save(async (err, result) => {
                if (!err) {
                    res.status(200).json({ "type": "success", "result": "Post Added Successfully" });
                    return;
                }
                console.log(err);
                res.status(500).json({ "type": "failure", "result": err });
                await Remover.RemoveImages(req.files);
            });
        }
    } catch (error) {
        console.log(error);
        await Remover.RemoveImages(req.files);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user', 'name image').sort([["createdAt", -1]]).limit(20);
        res.status(200).json({ "type": "success", "result": posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetPostByUser = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.query.userId }).populate('user', 'name image');
        res.status(200).json({ "type": "success", "result": posts });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.AddComment = async (req, res) => {
    try {
        console.log(req.body);
        const comment = new Comment(req.body);
        const post = await Post.findById(comment.post);
        if (!post) {
            res.status(500).json({ "type": "failure", "result": "Post ID Not Exists" });
        } else {
            comment.save(async (err, result) => {
                if (!err) {
                    res.status(200).json({ "type": "success", "result": "Comment Added Successfully" });
                    return;
                }
                console.log(err);
                res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.AddReply = async (req, res) => {
    try {
        const commentId = req.query.commentId;
        const reply = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(500).json({ "type": "failure", "result": "Comment ID Not Exist" });
        } else {
            const response = await Comment.findByIdAndUpdate(commentId, { $push: { replies: [reply] } });
            if (!response) {
                res.status(500).json({ "type": "failure", "result": "Server not Responding. Try Again" });
                return;
            }
            res.status(200).json({ "type": "success", "result": "Reply Added Successfully" });
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetComments = async (req, res) => {
    try {
        const post = await Post.findById(req.query.postId);
        if (!post) {
            res.status(500).json({ "type": "failure", "result": "Post ID Not Exists" });
        } else {
            const comments = await Comment.find({ post: req.query.postId }).populate('user', 'name image').populate('replies.user', 'name image');
            res.status(200).json({ "type": "success", "result": comments });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}