const { body } = require("express-validator");

exports.userHandler = [
    body("email").notEmpty().withMessage("Email is Missing").isEmail().withMessage("Invalid Email Format"),
    body("password").notEmpty().withMessage("Password is Missing").isLength({ min: 8, max: 20 }).withMessage("Password length Should be between 8 to 20 Character Long"),
    body("name").notEmpty().withMessage("Name is Missing"),
];