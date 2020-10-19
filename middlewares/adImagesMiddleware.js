const multer = require('multer');
const sharp = require("sharp");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

exports.upload = multer({ storage: storage });