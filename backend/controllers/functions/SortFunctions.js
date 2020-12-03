exports.GetKey = async (value) => {
    switch (value) {
        case "price":
            return "priceValue";
        case "date":
            return "createdAt";
        case "millage":
            return "millage";
        case "model":
            return "model";
        case "make":
            return "make";
        default:
            break;
    }
}
exports.GetSortValue = async (value) => {
    if (value === "a") {
        return 1;
    } else {
        return -1;
    }
}