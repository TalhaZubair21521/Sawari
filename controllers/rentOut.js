const Rent = require("../models/rent");
const { validationResult } = require("express-validator");
const Remover = require("./functions/imageResizer");
const Ranger = require("./functions/rangeFilter");
const Haversine = require("./functions/HaversineFormula");
const User = require("../models/user");

exports.InsertRentOut = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.errors.length != 0) {
            await Remover.RemoveImages(req.files);
            res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
            return;
        } else {
            const rent = new Rent(req.body);
            rent.sold = false;
            const user = await User.findById(rent.user);
            if (!user) {
                await Remover.RemoveImages(req.files);
                res.status(401).json({ type: "failure", "result": "No Such User" });
                return;
            }
            const filesArray = await Remover.ResizeImages(rent._id, req.files);
            rent.images = filesArray;
            rent.save(async (err) => {
                if (!err) {
                    res.status(200).json({ "type": "success", "result": "Ad Successfully Posted" });
                } else {
                    console.log("Error as : " + err);
                    await Remover.RemoveImages(req.files);
                    res.status(500).json({ "type": "failure", "result": "Server Not Responding" + err });
                }
            });
        }
    } catch (error) {
        await Remover.RemoveImages(req.files);
        console.log(error);
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
        const rentOuts = await Rent.find();
        res.status(200).json({ "type": "success", "result": rentOuts });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetRentOut = async (req, res) => {
    try {
        const rentOut = await Ad.findById(req.query.rentOutId);
        if (rentOut) {
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
exports.GetFilteredRentOuts = async (req, res) => {
    try {
        const currentLat = req.query.currentLat;
        const currentLon = req.query.currentLon;

        //Creating Two Types of Filter

        let filter = req.body;
        let rangeFilter = {};

        //Getting Values of Min and Max

        const minSeats = filter.minseats;
        const maxSeats = filter.maxseats;

        const minPrice = filter.minprice;
        const maxPrice = filter.maxprice;

        const minModel = filter.minmodel;
        const maxModel = filter.maxmodel;

        const minMillage = filter.minmillage;
        const maxMillage = filter.maxmillage;

        const minEngine = filter.minengine;
        const maxEngine = filter.maxengine;

        const distanceRadius = filter.distance;

        console.log(distanceRadius);

        //Deleting values that are stored in Objects

        delete filter.minseats;
        delete filter.minseats;

        delete filter.minprice;
        delete filter.maxprice;

        delete filter.minmodel;
        delete filter.maxmodel;

        delete filter.minmillage;
        delete filter.maxmillage;

        delete filter.minengine;
        delete filter.maxengine;

        delete filter.distance;

        //Range Filter Finder

        const seatsRange = await Ranger.RangeFilter(minSeats, maxSeats);
        const modelRange = await Ranger.RangeFilter(minModel, maxModel);
        const millageRange = await Ranger.RangeFilter(minMillage, maxMillage);
        const engineRange = await Ranger.RangeFilter(minEngine, maxEngine);
        const priceRange = await Ranger.RangeFilter(minPrice, maxPrice);

        //Adding Filter if Exists

        if (seatsRange !== null) {
            rangeFilter.seats = seatsRange.range;
        }
        if (modelRange !== null) {
            rangeFilter.model = modelRange.range;
        }
        if (millageRange !== null) {
            rangeFilter.millage = millageRange.range;
        }
        if (priceRange !== null) {
            rangeFilter.priceValue = priceRange.range;
        }
        if (engineRange !== null) {
            rangeFilter.engineValue = engineRange.range;
        }

        //Displaying Final Filters

        console.log({ ...filter, ...rangeFilter });

        //Finding Filter

        const rents = await Rent.find({ ...filter, ...rangeFilter }); // .sort("price", -1).limit(20);

        //Query Result

        console.log(rents);

        //Filtered by Radius

        if (!(typeof distanceRadius === 'undefined')) {
            // const filteredRents = rents.filter((rent) => {
            //     const distance = Haversine.CalculateDistance(currentLat, currentLon, rent.latitude, rent.longitude);
            //     if (distance <= distanceRadius) {
            //         return rent;
            //     }
            //     return false;
            // });
        }
        //Sending Reponse

        res.status(200).json({ "type": "success", "result": rents });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}