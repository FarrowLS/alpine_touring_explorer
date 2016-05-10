(function () {
    // To be fixed
    angular
        .module('ateApp')
        .directive('ateFooter', ateFooter);

    function ateFooter () {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/ateFooter/ateFooter.template.html'
        };
    }
})();