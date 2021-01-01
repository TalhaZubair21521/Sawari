const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

const Remover = require("./functions/imageResizer");
const mongoose = require("mongoose");

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
        const userId = req.query.userId;
        // const posts = await Post.find({}).populate('user', 'name image').sort([["createdAt", -1]]).limit(20);
        const posts = await Post.aggregate([
            {
                $addFields: {
                    isliked: { $in: [mongoose.Types.ObjectId(userId), "$likes"] }
                }
            },
            {
                $lookup: {
                    from: 'users', localField: 'user', foreignField: '_id', as: 'user'
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 20 }
        ]);
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

exports.getPostsPaginated = async (req, res) => {
    const { page, perPage } = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10
    };
    const posts = await Post.paginate({}, options);
    res.send({ result: posts })
}

exports.Liked = async (req, res) => {
    try {
        const userId = req.query.userId;
        const postId = req.query.postId;
        const post = await Post.findOne({ likes: userId });
        if (post) {
            res.status(200).json({ "type": "success", "result": "Your Already Liked the Post" });
        } else {
            const response = await Post.findByIdAndUpdate(postId, { $push: { likes: [userId] } })
            if (!response) {
                res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
                return;
            }
            res.status(200).json({ "type": "success", "result": "Post Liked Successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.UnLiked = async (req, res) => {
    try {
        const userId = req.query.userId;
        const postId = req.query.postId;
        const response = await Post.findByIdAndUpdate(postId, { $pullAll: { likes: [userId] } })
        if (!response) {
            console.log(response);
            res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
            return;
        }
        res.status(200).json({ "type": "success", "result": "Post UnLiked Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}