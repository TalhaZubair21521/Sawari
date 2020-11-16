const Car = require("../models/car");

const fetch = require('node-fetch');

exports.AddCars = async (req, res) => {
    try {
        const response = await fetch(
            'https://parseapi.back4app.com/classes/Car_Model_List?limit=9581&keys=Make,Model',
            {
                headers: {
                    'X-Parse-Application-Id': 'hlhoNKjOvEhqzcVAJ1lxjicJLZNVv36GdbboZj3Z',
                    'X-Parse-Master-Key': 'SNMJJF0CZZhTPhLDIqGhTlUNV9r60M2Z5spyWfXW',
                }
            }
        );
        const data = await response.json();
        const cars = data["results"];
        cars.forEach(async (car) => {
            const c = new Car({ make: car["Make"], model: car["Model"] });
            await c.save();
        });
        res.send("Added")
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}
exports.GetMakes = async (req, res) => {
    try {
        const cars = await Car.distinct('make');
        res.status(200).json({ "type": "success", "result": cars });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}
exports.GetModelsByMake = async (req, res) => {
    try {
        const make = req.query.make;
        const cars = await Car.find({ make: make }, 'model');
        res.status(200).json({ "type": "success", "result": cars });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "type": "failure", "result": "Server Not Responding" });
    }
}