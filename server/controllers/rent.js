const Rent = require("../models/rent");
const { validationResult } = require("express-validator");
const Remover = require("./functions/imageResizer");
const Ranger = require("./functions/rangeFilter");
const Haversine = require("./functions/HaversineFormula");
const ArrayFunctions = require("./functions/ArrayFunctions");
const User = require("../models/user");
const SortHelpers = require("./functions/SortFunctions");

exports.GetRent = async (req, res) => {
    try {
        const rent = await Rent.findById(req.query.Id).populate('user', 'name');
        res.status(200).json({ "type": "success", "result": rent });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.InsertRent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.errors.length != 0) {
            await Remover.RemoveImages(req.files);
            res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
            return;
        } else {
            const rent = new Rent(req.body);
            rent.rentOuted = false;
            const user = await User.findById(rent.user);
            if (!user) {
                await Remover.RemoveImages(req.files);
                res.status(401).json({ type: "failure", "result": "No Such User" });
                return;
            }
            const filesArray = await Remover.ResizeImages("rents/" + rent._id, req.files);
            rent.images = filesArray;
            rent.save(async (err) => {
                if (!err) {
                    res.status(200).json({ "type": "success", "result": "Rent Successfully Posted" });
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

exports.GetRentsByUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        const rents = await Rent.find({ user: userId }).sort('createdAt');
        res.status(200).json({ "type": "success", "result": rents });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.GetAllRents = async (req, res) => {
    try {
        const hiringType = req.query.hiringType;
        const rents = await Rent.find({ hiringType: hiringType });
        res.status(200).json({ "type": "success", "result": rents });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}


exports.GetFilteredRents = async (req, res) => {
    try {

        //Changing Model to Model Key from min max from Frontend Request
        // console.log("Body :", req.body);

        //Creating Two Types of Filter

        req.body.sold = false;
        let filter = req.body.filter;
        let sortBy = req.body.sortBy;
        let rangeFilter = {};

        //Getting Values of Min and Max

        const currentLat = filter.currentLat;
        const currentLon = filter.currentLon;

        delete filter.currentLat;
        delete filter.currentLon;

        const minYear = filter.minYear;
        const maxYear = filter.maxYear;

        const minSeats = filter.minseats;
        const maxSeats = filter.maxseats;

        const minPrice = filter.minprice;
        const maxPrice = filter.maxprice;

        const minMillage = filter.minmillage;
        const maxMillage = filter.maxmillage;

        const minEngine = filter.minengine;
        const maxEngine = filter.maxengine;

        const distanceRadius = filter.distance;

        // console.log("Distance Radius :", distanceRadius);

        //Deleting values that are stored in Objects

        delete filter.minseats;
        delete filter.maxseats;

        delete filter.minprice;
        delete filter.maxprice;

        delete filter.minmillage;
        delete filter.maxmillage;

        delete filter.minengine;
        delete filter.maxengine;

        delete filter.minYear;
        delete filter.maxYear;

        delete filter.distance;

        //Range Filter Finder

        const seatsRange = await Ranger.RangeFilter(minSeats, maxSeats);
        const millageRange = await Ranger.RangeFilter(minMillage, maxMillage);
        const engineRange = await Ranger.RangeFilter(minEngine, maxEngine);
        const priceRange = await Ranger.RangeFilter(minPrice, maxPrice);
        const yearRange = await Ranger.RangeFilter(minYear, maxYear);

        //Adding Filter if Exists

        if (seatsRange !== null) {
            rangeFilter.seats = seatsRange.range;
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
        if (yearRange !== null) {
            rangeFilter.year = yearRange.range;
        }

        //Displaying Final Filters

        const completeFilter = { ...filter, ...rangeFilter };
        // console.log("Filter :", completeFilter);

        //Finding Filter

        let rents = null;
        if (!(typeof sortBy === 'undefined') && !(sortBy === null)) {
            // console.log("Yes Sort By");
            const column = await SortHelpers.GetKey(sortBy.column);
            const sort = await SortHelpers.GetSortValue(sortBy.sort);
            // console.log(column, sort);

            rents = await Rent.find(completeFilter).populate('user', 'name').sort([[column, sort]]);
        } else {
            // console.log("No Sort By");
            rents = await Rent.find(completeFilter).populate('user', 'name'); // .sort("price", -1).limit(20);
        }
        //Query Result

        // console.log("Rents :", rents.length);

        //Filtered by Radius
        if (!(typeof distanceRadius === 'undefined')) {
            // console.log("There was Radius")
            const filteredRents = rents.filter((rent) => {
                const distance = Haversine.CalculateDistance(currentLat, currentLon, rent.latitude, rent.longitude);
                if (distance <= distanceRadius) {
                    return rent;
                }
                return false;
            });
            // console.log("Filter :", filteredRents.length);
            res.status(200).json({ "type": "success", "result": filteredRents });
            return;
        } else {
            // console.log("There was no Radius");
            // console.log("");
            res.status(200).json({ "type": "success", "result": rents });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}


exports.ChangeRentOutedStatus = async (req, res) => {
    try {
        const rentOuted = req.query.rentOuted;
        const rentID = req.query.rentID;
        const response = await Rent.findByIdAndUpdate(rentID, { $set: { rentOuted: rentOuted } });
        if (!response) {
            res.status(500).json({ "type": "failure", "result": "Server not Responding. Try Again" });
            return;
        }
        res.status(200).json({ "type": "success", "result": "Rent Edit Successfully" });
    } catch (error) {
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}

exports.UpdateRent = async (req, res) => {
    try {
        let body = req.body;
        let deletedImages = await ArrayFunctions.ConvertToArray(JSON.parse(body.oldImages));
        let newFiles = req.files;
        delete body.oldImages;
        let updatedRent = new Rent(body);
        let oldRent = await Rent.findById(updatedRent._id);
        let oldImagesFromDatabase = oldRent.images
        const errors = validationResult(req);
        if (errors.errors.length != 0) {
            await Remover.RemoveImages(req.files);
            res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
            return;
        } else {
            const user = await User.findById(updatedRent.user);
            if (!user) {
                await Remover.RemoveImages(req.files);
                res.status(401).json({ type: "failure", "result": "No Such User" });
                return;
            }
            const filesArray = await Remover.ResizeImages("rents/" + updatedRent._id, newFiles);
            const updatedArray = await ArrayFunctions.UpdatedArray(deletedImages, oldImagesFromDatabase, filesArray);
            updatedRent.images = updatedArray;
            await Rent.findByIdAndUpdate(updatedRent._id, { $set: updatedRent });
            res.status(200).json({ type: "success", result: "Rent Updated Successfully" });
        }
    } catch (error) {
        await Remover.RemoveImages(req.files);
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" + error });
    }
}