(function () {
    angular
        .module('ateApp')
        .directive('navigation', navigation);

    function navigation () {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/navigation/navigation.template.html'
        };
    }
})();