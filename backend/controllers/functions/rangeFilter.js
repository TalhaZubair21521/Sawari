exports.RangeFilter = async (minValue, maxValue) => {
    let filter = {};
    if ((typeof minValue === 'undefined') && (typeof maxValue === 'undefined')) {
        return null;
    } else if (!(typeof minValue === 'undefined') && !(typeof maxValue === 'undefined')) {
        filter.range = { $gte: minValue, $lte: maxValue };
        return filter;
    } else {
        if (typeof minValue === 'undefined') {
            filter.range = { $lte: maxValue };
            return filter;
        } else {
            filter.range = { $gte: minValue };
            return filter;
        }
    }
}