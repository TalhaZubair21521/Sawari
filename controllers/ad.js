const Ad = require("../models/ad");
const { validationResult } = require("express-validator");
const Remover = require("./functions/imageResizer");
const Ranger = require("./functions/rangeFilter");
const Haversine = require("./functions/HaversineFormula");
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
		const ads = await Ad.find({ user: userId });
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
		res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
	}
}

exports.FilterAds = async (req, res) => {
	try {
		console.log("Body :", req.body);

		//Creating Two Types of Filter

		let filter = req.body;
		let rangeFilter = {};

		//Getting Values of Min and Max

		const currentLat = filter.currentLat;
		const currentLon = filter.currentLon;

		delete filter.currentLat;
		delete filter.currentLon;

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

		console.log("Distance Radius :", distanceRadius);

		//Deleting values that are stored in Objects

		delete filter.minseats;
		delete filter.maxseats;

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

		const completeFilter = { ...filter, ...rangeFilter };
		console.log("Filter :", completeFilter);

		//Finding Filter

		const ads = await Ad.find(completeFilter); // .sort("price", -1).limit(20);

		//Query Result

		console.log("Ads :", ads.length);

		//Filtered by Radius
		if (!(typeof distanceRadius === 'undefined')) {
			console.log("There was Radius")
			const filteredAds = ads.filter((ad) => {
				const distance = Haversine.CalculateDistance(currentLat, currentLon, ad.latitude, ad.longitude);
				if (distance <= distanceRadius) {
					return ad;
				}
				return false;
			});
			console.log("Filter :", filteredAds.length);
			res.status(200).json({ "type": "success", "result": filteredAds });
			return;
		} else {
			console.log("There was no Radius");
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