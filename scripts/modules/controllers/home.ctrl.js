'use strict';

module.exports = [
    '$scope',
    '$rootScope',
    '$timeout',
    function ($scope, $rootScope, $timeout) {
        // body...
        var vm = this;
        vm.text = 'Hello';
        vm.data = [{
            type: 'polygon',
            coords: [{
                lat: 23.674712836608776,
                lng: 85.18798828125
            }, {
                lat: 23.175713800385203,
                lng: 85.14404296875
            }, {
                lat: 23.311990950585997,
                lng: 85.9075927734375
            }]
        }, {
            type: 'circle',
            center: {
                lat: 23.175713800385203,
                lng: 87.3468017578125
            },
            radius: 67721.15924242369
        }];
        vm.googleApiKey = 'AIzaSyA4JZLPpoHa-yAdTh4WiA_CGAGWCACxa2c';
    }
];