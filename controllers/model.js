const Make = require("../models/make");

exports.AddMake = async (req, res) => {
    try {
        const makes = new Make(req.body);
        makes.save(async (err) => {
            if (err) {
                res.status(400).json({ "type": "failure", "result": "Error Occured" });
            } else {
                res.status(200).json({ "type": "success", "result": "Models Added Successfully" });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}
exports.GetMakes = async (req, res) => {
    try {
        const makes = await Make.find();
        res.status(200).json({ type: "success", result: makes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}