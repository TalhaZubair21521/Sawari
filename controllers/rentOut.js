const Rent = require("../models/rent");
const { validationResult } = require("express-validator");
const Helper = require("./functions/imageResizer");
const User = require("../models/user");

exports.InsertRentOut = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.errors.length != 0) {
            await Helper.RemoveImages(req.files);
            res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
            return;
        } else {
            const ad = new Rent(req.body);
            ad.sold = false;
            const user = await User.findById(ad.user);
            if (!user) {
                await Helper.RemoveImages(req.files);
                res.status(401).json({ type: "failure", "result": "No Such User" });
                return;
            }
            const filesArray = await Helper.ResizeImages(ad._id, req.files);
            ad.images = filesArray;
            ad.save(async (err) => {
                if (!err) {
                    res.status(200).json({ "type": "success", "result": "Rent Out Service Successfully Added" });
                } else {
                    console.log("Error as : " + err);
                    await Helper.RemoveImages(req.files);
                    res.status(500).json({ "type": "failure", "result": "Server Not Responding" + err });
                }
            });
        }
    } catch (error) {
        await Helper.RemoveImages(req.files);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" + error });
    }
};

exports.GetRentOutByUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        const rentOuts = await Rent.find({ user: userId });
        res.status(200).json({ "type": "success", "result": rentOuts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetAllRentOuts = async (req, res) => {
    try {
        const rentOuts = await Rent.find({ hiringType: req.query.hiringType });
        res.status(200).json({ "type": "success", "result": rentOuts });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetRentOut = async (req, res) => {
    try {
        const rentOut = await Ad.findById(req.query.rentOutId);
        if (ad) {
            res.status(200).json({ "type": "success", "result": rentOut });
            return;
        } else {
            res.status(401).json({ "type": "failure", "result": "Rent out does not exists" });
            return;
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.DeleteRentOut = async (req, res) => {
    try {
        const response = await Rent.findByIdAndDelete(req.query.rentOutId);
        if (response) {
            res.status(200).json({ "type": "success", "result": "Rent Out Deleted Successfully" });
        } else {
            res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.UpdateRentOut = async (req, res) => {
    try {
        console.log(req.body);
        res.status(200).json({ "type": "success", "result": "Rent Out Updated Successfully" });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}