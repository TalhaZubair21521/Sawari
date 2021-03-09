const fs = require("fs");

exports.RemoveImages = async (files) => {
    await files.forEach(async (image) => {
        const filePath = "assets/" + image.filename;
        fs.unlinkSync(filePath);
    });
}