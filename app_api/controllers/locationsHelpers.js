module.exports.theEarth = (function () {
    var earthRadius = 6371; // in kilometers

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();