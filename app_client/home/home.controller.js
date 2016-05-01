(function () {
    angular
        .module('ateApp')
        .controller('homeCtrl', homeCtrl);

    function homeCtrl ($scope, ateData, geolocation) {
        var vm = this;
        
        vm.pageHeader = {
            title: 'Places to go earn your turns'
        }
        
        vm.message = "Checking your location";

        vm.getData = function (position) {
            var lat = position.coords.latitude,
                lng = position.coords.longitude;
            vm.message = "Searching for places to go";
            ateData.locationByCoords(lat, lng)
                .success(function (data) {
                    vm.message = data.length > 0 ? "" : "No locations found";
                    vm.data = {locations: data};
                })
                .error(function (e) {
                    vm.message = "Error";
                });
        };

        vm.showError = function (error) {
            $scope.$apply(function () {
                vm.message = error.message;
            });
        };

        vm.noGeo = function () {
            $scope.$apply(function () {
                vm.message = "Geolocation is not supported by this browser.";
            });
        };

        geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);
    }
})();