const User = require("../models/user");
const { validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const Remover = require("./functions/imageResizer");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const fs = require("fs");
exports.Signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.errors.length != 0) {
            res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
            return;
        } else {
            const user = new User(req.body);
            user.forgetKey = new Date().getTime();
            user.password = await User.ConvertToHash(user.password);
            const oldUser = await User.findOne({ email: user.email });
            if (oldUser) {
                res.status(400).json({ "type": "failure", "result": "Email already Exist. Choose a Different Email" });
                return;
            }
            user.save(async (err) => {
                if (err && err.code === 11000) {
                    const keyName = Object.keys(err.keyValue)[0];
                    const attributeName = keyName.charAt(0).toUpperCase() + keyName.slice(1);
                    res.status(400).json({ "type": "failure", "result": attributeName + " already Exist. Choose a Different " + attributeName });
                } else {
                    res.status(200).json({ "type": "success", "result": "User Registered Successfully" });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
};

exports.Signin = async (req, res) => {
    try {
        var user = await User.findOne({ email: req.query.email });
        if (!user) {
            res.status(401).json({ type: "failure", "result": "No User With Such Email Exists" });
        } else {
            const isEqual = await User.isPasswordEqual(req.query.password, user.password);
            if (isEqual) {
                const token = JWT.sign({ username: user.name }, JWT_SECRET_KEY);
                res.status(200).json({ "type": "success", "result": "User Login Successfully", "token": token, "id": user._id });
            } else {
                res.status(401).json({ "type": "failure", "result": "Wrong Password" });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
};

exports.UpdateProfile = async (req, res) => {
    try {
        const userId = req.query.userId;
        const oldUser = await User.findById(userId);
        if (oldUser.image === null) {
            const filesArray = await Remover.ResizeImages("users/" + userId, [req.file]);
            const user = { ...req.body, image: filesArray[0] };
            const response = await User.findByIdAndUpdate(userId, { $set: user });
            if (!response) {
                res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
                return;
            }
            res.status(200).json({ "type": "success", "result": "Profile Updated Successfully" });
            return;
        } else {
            fs.unlinkSync(oldUser.image);
            const filesArray = await Remover.ResizeImages("users/" + userId, [req.file]);
            const user = { ...req.body, image: filesArray[0] };
            const response = await User.findByIdAndUpdate(userId, { $set: user });
            if (!response) {
                res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
                return;
            }
            res.status(200).json({ "type": "success", "result": "Profile Updated Successfully" });
            return;
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}









exports.OauthGoogle = async (req, res) => {
    try {
        console.log(req.body);
        res.status(200).json({ "type": "success", "result": "Facebook OAuth Not Working" });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}
exports.OauthFacebook = async (req, res) => {
    try {
        console.log(req.body);
        res.status(200).json({ "type": "success", "result": "Google OAuth Not Wokring Yet" });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}