(function () {
    angular
        .module('ateApp')
        .service('geolocation', geolocation);

    function geolocation () {
        var getPosition = function (cbSuccess, cbError) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
            }
            else {
                cbNoGeo();
            }
        };
        return {
            getPosition : getPosition
        };
    }
})();