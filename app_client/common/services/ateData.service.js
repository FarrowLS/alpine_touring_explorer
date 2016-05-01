(function () {
    angular
        .module('ateApp')
        .service('ateData', ateData);

    function ateData ($http) {
      var locationByCoords = function (lat, lng) {
        return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=2000000000');
      };
      return {
        locationByCoords : locationByCoords
      };
    };
})();