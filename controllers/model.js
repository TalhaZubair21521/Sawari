const Model = require("../models/model");

exports.AddModels = async (req, res) => {
    try {
        const models = new Model(req.body);
        models.save(async (err) => {
            if (err) {
                res.status(400).json({ "type": "failure", "result": "Error Occured" });
            } else {
                res.status(200).json({ "type": "success", "result": "Models Added Successfully" });
            }
        });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}
exports.GetModels = async (req, res) => {
    try {
        const models = await Model.find('names');
        res.send(200).json({ type: "success", result: models });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}