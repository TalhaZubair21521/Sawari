const { body } = require("express-validator");

exports.adHandler = [
    body("email").notEmpty().withMessage("Email is Missing").isEmail().withMessage("Invalid Email Format"),
    body("phone").notEmpty().withMessage("Name is Missing"),
    body("address").notEmpty().withMessage("Address is Missing"),
    body("type").notEmpty().withMessage("Type is Missing"),
    body("color").notEmpty().withMessage("Color is Missing"),
    body("price").notEmpty().withMessage("Price is Missing").isNumeric().withMessage("Invalid Price"),
    body("doors").notEmpty().withMessage("Doors is Missing").isNumeric().withMessage("Invalid Doors"),
    body("millage").notEmpty().withMessage("Millage is Missing").isNumeric().withMessage("Invalid Millage"),
    body("minSeats").notEmpty().withMessage("Min Seats is Missing").isNumeric().withMessage("Invalid Min Seats"),
    body("maxSeats").notEmpty().withMessage("Max Seats is Missing").isNumeric().withMessage("Invalid Max Seats"),
    body("bodyType").notEmpty().withMessage("Body Type is Missing"),
    body("fuel").notEmpty().withMessage("Fuel is Missing"),
    body("gear").notEmpty().withMessage("Gear is Missing"),
    body("engine").notEmpty().withMessage("Engine is Missing"),
    body("city").notEmpty().withMessage("City is Missing"),
    body("make").notEmpty().withMessage("Make is Missing"),
    body("model").notEmpty().withMessage("Model is Missing"),
    body("distance").notEmpty().withMessage("Distance is Missing"),
];