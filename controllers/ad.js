const Ad = require("../models/ad");
const { validationResult } = require("express-validator");
const Helper = require("./functions/imageResizer");
const User = require("../models/user");

exports.InsertAd = async (req, res) => {
    try {
        console.log("Here");
        console.log(req.body);
        const errors = validationResult(req);
        if (errors.errors.length != 0) {
            await Helper.RemoveImages(req.files);
            res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
            return;
        } else {
            const ad = new Ad(req.body);
            const user = User.findById(ad.user);
            if (!user) {
                await Helper.RemoveImages(req.files);
                res.status(401).json({ type: "failure", "result": "No Such User" });
            }
            const filesArray = await Helper.ResizeImages(ad._id, req.files);
            ad.images = filesArray;
            ad.save(async (err) => {
                if (!err) {
                    res.status(200).json({ "type": "success", "result": "Ad Successfully Posted" });
                } else {
                    console.log(err);
                    res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
                }
            });
        }
    } catch (error) {
        await Helper.RemoveImages(req.files);
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
};

exports.GetAdsByUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        const ads = await Ad.find({ user: userId }, 'name price images');
        res.status(200).json({ "type": "success", "result": ads });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetAllAds = async (req, res) => {
    try {
        const ads = await Ad.find();
        res.status(200).json({ "type": "success", "result": ads });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.FilterAds = async (req, res) => {
    try {
        const filters = req.body;
        const price = filters.price;
        const minMillage = filters.minMillage;
        const maxMillage = filters.maxMillage;
        delete filters.price;
        delete filters.minMillage;
        delete filters.maxMillage;
        console.log(filters);
        if (price === "high") {
            const ads = await Ads.find({ ...filters, millage: { $gte: minMillage, $lte: maxMillage } }).sort("price", -1).limit(20);
            res.status(200).json({ "type": "success", "result": ads });
        } else {
            const ads = await Ads.find({ ...filters, millage: { $gte: minMillage, $lte: maxMillage } }).sort("price", 1).limit(20);
            res.status(200).json({ "type": "success", "result": ads });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.query.adId);
        if (ad) {
            res.status(200).json({ "type": "success", "result": ad });
            return;
        } else {
            res.status(401).json({ "type": "failure", "result": "Ad does not exists" });
            return;
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.EditAd = async (req, res) => {
    try {
        console.log(req.body);

        res.status(200).json({ "type": "success", "result": "Edited Ad Successfully" });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.DeleteAd = async (req, res) => {
    try {
        const response = await Ad.findByIdAndDelete(req.query.adId);
        if (response) {
            res.status(200).json({ "type": "success", "result": "Ad Deleted Successfully" });
        } else {
            res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}