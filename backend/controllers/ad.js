const Ad = require("../models/ad");
const { validationResult } = require("express-validator");
const Remover = require("./functions/imageResizer");
const Ranger = require("./functions/rangeFilter");
const SortHelpers = require("./functions/SortFunctions");
const Haversine = require("./functions/HaversineFormula");
const ArrayFunctions = require("./functions/ArrayFunctions");
const User = require("../models/user");

exports.InsertAd = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (errors.errors.length != 0) {
			await Remover.RemoveImages(req.files);
			res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
			return;
		} else {
			const ad = new Ad(req.body);
			ad.sold = false;
			const user = await User.findById(ad.user);
			if (!user) {
				await Remover.RemoveImages(req.files);
				res.status(401).json({ type: "failure", "result": "No Such User" });
				return;
			}
			const filesArray = await Remover.ResizeImages(ad._id, req.files);
			ad.images = filesArray;
			ad.save(async (err) => {
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

exports.GetAdsByUser = async (req, res) => {
	try {
		const userId = req.query.userId;
		const ads = await Ad.find({ user: userId }).sort('createdAt');
		res.status(200).json({ "type": "success", "result": ads });
	} catch (error) {
		console.log(error);
		res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
	}
}

exports.GetAllAds = async (req, res) => {
	try {
		const hiringType = req.query.hiringType;
		const ads = await Ad.find({ hiringType: hiringType });
		res.status(200).json({ "type": "success", "result": ads });
	} catch (error) {
		console.log(error);
		res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
	}
}

exports.FilterAds = async (req, res) => {
	try {
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

		let ads = null;
		if (!(typeof sortBy === 'undefined') && !(sortBy === null)) {
			// console.log("Yes Sort By");
			const column = await SortHelpers.GetKey(sortBy.column);
			const sort = await SortHelpers.GetSortValue(sortBy.sort);
			console.log(column, sort);
			ads = await Ad.find(completeFilter).sort([[column, sort]]);
		} else {
			// console.log("No Sort By");
			ads = await Ad.find(completeFilter); // .sort("price", -1).limit(20);
		}
		//Query Result

		// console.log("Ads :", ads.length);

		//Filtered by Radius
		if (!(typeof distanceRadius === 'undefined')) {
			// console.log("There was Radius")
			const filteredAds = ads.filter((ad) => {
				const distance = Haversine.CalculateDistance(currentLat, currentLon, ad.latitude, ad.longitude);
				if (distance <= distanceRadius) {
					return ad;
				}
				return false;
			});
			// console.log("Filter :", filteredAds.length);
			res.status(200).json({ "type": "success", "result": filteredAds });
			return;
		} else {
			// console.log("There was no Radius");
			// console.log("");
			res.status(200).json({ "type": "success", "result": ads });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
	}
}

exports.ChangeSoldStatus = async (req, res) => {
	try {
		const sold = req.query.sold;
		const adID = req.query.adID;
		const response = await Ad.findByIdAndUpdate(adID, { $set: { sold: sold } });
		if (!response) {
			res.status(500).json({ "type": "failure", "result": "Server not Responding. Try Again" });
			return;
		}
		res.status(200).json({ "type": "success", "result": "Ad Edit Successfully" });
	} catch (error) {
		res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
	}
}


exports.UpdateAd = async (req, res) => {
	try {
		let body = req.body;
		let deletedImages = await ArrayFunctions.ConvertToArray(JSON.parse(body.oldImages));
		let newFiles = req.files;
		delete body.oldImages;
		let updatedAd = new Ad(body);
		let oldAd = await Ad.findById(updatedAd._id);
		let oldImagesFromDatabase = oldAd.images
		const errors = validationResult(req);
		if (errors.errors.length != 0) {
			await Remover.RemoveImages(req.files);
			res.status(400).json({ type: "failure", "result": errors.errors[0].msg });
			return;
		} else {
			const user = await User.findById(updatedAd.user);
			if (!user) {
				await Remover.RemoveImages(req.files);
				res.status(401).json({ type: "failure", "result": "No Such User" });
				return;
			}
			const filesArray = await Remover.ResizeImages(updatedAd._id, newFiles);
			const updatedArray = await ArrayFunctions.UpdatedArray(deletedImages, oldImagesFromDatabase, filesArray);
			updatedAd.images = updatedArray;
			await Ad.findByIdAndUpdate(updatedAd._id, { $set: updatedAd });
			res.status(200).json({ type: "success", result: "Ad Updated Successfully" });
		}
	} catch (error) {
		await Remover.RemoveImages(req.files);
		console.log(error);
		res.status(500).json({ "type": "failure", "result": "Server Not Responding" + error });
	}
}