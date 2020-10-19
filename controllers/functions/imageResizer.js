const fs = require("fs");
const sharp = require("sharp");

exports.ResizeImages = async (path, images) => {
    const destinationPath = "assets/" + path + "/";
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }
    var files = [];
    await images.forEach(async (image) => {
        const filePath = "assets/" + image.filename;
        const destinationFilename = destinationPath + image.filename;
        files.push(destinationFilename);
        const process = await sharp(filePath).resize(250, 200).toFile(destinationFilename);
        if (process) {
            fs.unlinkSync(filePath);
        } else {
            res.json({ type: "failure", result: "Server not responding. Try Again" })
        }
    });
    return files;
}