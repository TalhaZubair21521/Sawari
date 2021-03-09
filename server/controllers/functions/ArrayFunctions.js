const fs = require("fs");

exports.ConvertToArray = async (list) => {
    let files = [];
    list.forEach((l) => {
        files.push(l[0].uri);
    });
    return files;
}

exports.UpdatedArray = async (deletedImages, oldImages, newImages) => {
    var updatePreviousImages = oldImages;
    deletedImages.forEach(async (element, index) => {
        fs.unlinkSync(element);
        updatePreviousImages = updatePreviousImages.filter(e => {
            return e != element;
        });
    });
    return [...updatePreviousImages, ...newImages];
}
