const Ad = require("../models/ad");
const { validationResult } = require("express-validator");
const Helper = require("./functions/imageResizer");

exports.InsertAd = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.errors.length != 0) {
            res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
            return;
        } else {
            const ad = new Ad(req.body);
            const filesArray = await Helper.ResizeImages(ad._id, req.files);
            ad.images = filesArray;
            ad.save(async (err) => {
                if (!err) {
                    res.status(200).json({ "type": "success", "result": "Ad Successfully Posted" });
                } else {
                    res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
};
