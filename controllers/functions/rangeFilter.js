exports.RangeFilter = async (minValue, maxValue) => {
    let filter = {};
    if ((typeof minValue === 'undefined') && (typeof maxValue === 'undefined')) {
        console.log("Both are Undefined");
        return null;
    } else if (!(typeof minValue === 'undefined') && !(typeof maxValue === 'undefined')) {
        console.log("Both are Defined");
        filter.range = { $gte: minValue, $lte: maxValue };
        return filter;
    } else {
        if (typeof minValue === 'undefined') {
            filter.range = { $lte: maxValue };
            console.log("Max Value is Defined");
            return filter;
        } else {
            filter.range = { $gte: minValue };
            console.log("Min Value is Defined");
            return filter;
        }
    }
}