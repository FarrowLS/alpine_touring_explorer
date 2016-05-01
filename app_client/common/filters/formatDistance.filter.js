(function () {
    angular
        .module('ateApp')
        .filter('formatDistance', formatDistance);

    var _isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    function formatDistance () {
        return function (distance) {
            var numDistance,
                unit;
            if (distance && _isNumber(distance)) {
                numDistance = distance * 0.621371;
                if (numDistance > 1) {
                    unit = " miles";
                } else if (numDistance === 1) {
                    unit = " mile";
                } else {
                    unit = " of a mile"
                }
                return numDistance + unit;
            } else {
                return "";
            }
        };
    }
})();