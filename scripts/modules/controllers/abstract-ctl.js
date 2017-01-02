'use strict';

module.exports = [
    '$scope',
    '$rootScope',
    '$timeout',
    function($scope, $rootScope, $timeout) {
        // body...
        var vm = this;
        vm.text = 'Hello';
        vm.showLoader = false;

        $rootScope.$on('$stateChangeStart', function() {
            vm.showLoader = true;
        });

        $rootScope.$on('$stateChangeSuccess', function() {
            $timeout(function(){
            	vm.showLoader = false;
            },1000);
        });

        $rootScope.$on('$stateChangeError', function() {
            $timeout(function(){
            	vm.showLoader = false;
            },1000);
        });
    }
];
