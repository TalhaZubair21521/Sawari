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
