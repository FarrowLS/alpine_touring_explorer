(function () {
    angular
        .module('ateApp')
        .controller('aboutCtrl', aboutCtrl);

    function aboutCtrl () {
        var vm = this;
        vm.pageHeader = {
            title: "About Alpine Touring Explorer"
        };
        vm.main = {
            content: "[text to be added]"
        };
    }
})();