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
        }, {
            type: 'rectangle',
            bounds: {
                north: 23.82555130688476,
                south: 21.94304553343818,
                east: 92.30712890625,
                west: 88.92333984375
            }
        }];
        vm.config = {zoom:6};
        vm.googleApiKey = 'AIzaSyA4JZLPpoHa-yAdTh4WiA_CGAGWCACxa2c';
    }
];