(function () {
    angular.module('ateApp', ['ngRoute']);

    function config ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});
    }

    angular
        .module('ateApp')
        .config(['$routeProvider', config]);
})();