'use strict';

module.exports = [function () {
    return {
        restrict: 'AE',
        template: require('../templates/gmap-dir.html'),
        scope: {
            apiKey: '=',
            cordArr: '=',
            circleOptions: '@',
            polygonOptions: '@'
        },
        link: function (scope, elem, attrs) {
            scope.map = undefined;

            var _circleOptions = {
                fillColor: '#AA0000',
                fillOpacity: 0.35,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                zIndex: 1,
                draggable: true,
                geodesic: false,
                strokeColor: '#AA0000',
                strokeOpacity: 0.8
            };
            var _polygonOptions = {
                fillColor: '#0000FF',
                fillOpacity: 0.35,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                zIndex: 1,
                draggable: true,
                strokeColor: '#0000FF',
                strokeOpacity: 0.8
            };
            scope.circleOptions = scope.circleOptions?scope.circleOptions:{};
            scope.polygonOptions = scope.polygonOptions?scope.polygonOptions:{};
            scope.circleOptions = genOptions(scope.circleOptions, _circleOptions);
            scope.polygonOptions = genOptions(scope.polygonOptions, _polygonOptions);

            window.mapInit = function () {
                initMap();
            }
            if (!window.google || !window.google.maps) {
                var d = document,
                    s = 'script',
                    id = 'gmap-sdk';
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "https://maps.googleapis.com/maps/api/js?key=" + scope.apiKey + '&callback=mapInit&libraries=drawing';
                fjs.parentNode.insertBefore(js, fjs);
            } else {
                window.mapInit();
            }

            function genOptions(source, target) {
                if (!source) {
                    source = {};
                }
                var res = {};
                var arr = Object.keys(source);
                for (var i = 0; i < arr.length; i++) {
                    res[arr[i]] = source[arr[i]];
                }
                arr = Object.keys(target);
                for (var i = 0; i < arr.length; i++) {
                    if (source[arr[i]]) {
                        res[arr[i]] = source[arr[i]];
                    } else {
                        res[arr[i]] = target[arr[i]];
                    }
                }
                console.log(source, target, res);
                return res;
            }

            function initMap() {
                scope.polygons = [];
                scope.circles = [];
                scope.clearSelection = function () {
                    if (scope.selectedShape) {
                        scope.selectedShape.setEditable(false);
                        scope.selectedShape = null;
                    }
                }

                scope.setSelection = function (shape) {
                    scope.clearSelection();
                    scope.selectedShape = shape;
                    shape.setEditable(true);
                    // selectColor(shape.get('fillColor') || shape.get('strokeColor'));
                }

                scope.deleteSelectedShape = function () {
                    if (scope.selectedShape) {
                        if (scope.polygons.indexOf(scope.selectedShape) >= 0) {
                            scope.polygons.splice(scope.polygons.indexOf(scope.selectedShape), 1);
                        }

                        if (scope.circles.indexOf(scope.selectedShape) >= 0) {
                            scope.circles.splice(scope.circles.indexOf(scope.selectedShape), 1);
                        }
                        scope.selectedShape.setMap(null);
                    }
                }
                scope.map = new google.maps.Map(document.getElementById('map'), {
                    center: {
                        lat: 22.5726,
                        lng: 88.363
                    },
                    zoom: 8,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        mapTypeIds: ['roadmap', 'terrain']
                    }
                });

                var drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.MARKER,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
                    },
                    markerOptions: {
                        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                    },
                    circleOptions: scope.circleOptions,
                    polygonOptions: scope.polygonOptions
                });

                for (var i = 0; i < scope.cordArr.length; i++) {
                    if (scope.cordArr[i].type == 'polygon') {
                        var poly = new google.maps.Polygon(genOptions({
                            map: scope.map,
                            paths: scope.cordArr[i].coords
                        }, scope.polygonOptions));
                        poly.setMap(scope.map);
                        google.maps.event.addListener(poly, 'click', function () {
                            scope.setSelection(poly);
                        });
                        scope.polygons.push(poly);
                    } else if (scope.cordArr[i].type == 'circle') {
                        var circ = new google.maps.Circle(genOptions({
                            map: scope.map,
                            center: scope.cordArr[i].center,
                            radius: scope.cordArr[i].radius,
                        }, scope.circleOptions));
                        circ.setMap(scope.map);
                        google.maps.event.addListener(circ, 'click', function () {
                            scope.setSelection(circ);
                        });
                        scope.circles.push(circ);
                    }

                }

                google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
                    polygon.setMap(scope.map);
                    google.maps.event.addListener(polygon, 'click', function () {
                        scope.setSelection(polygon);
                    });
                    scope.polygons.push(polygon);
                });

                google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {
                    circle.setMap(scope.map);
                    google.maps.event.addListener(circle, 'click', function () {
                        scope.setSelection(circle);
                    });
                    scope.circles.push(circle);
                });

                drawingManager.setMap(scope.map);
            }
        },
        controller: ['$scope', function ($scope) {
            $scope.print = function () {

                for (var i = 0; i < $scope.polygons.length; i++) {
                    console.log('------------------');
                    var arr = $scope.polygons[i].getPath().getArray();
                    for (var j = 0; j < arr.length; j++) {
                        console.log(arr[j].lat(), arr[j].lng());
                    }
                    console.log('------------------');
                }

                for (var i = 0; i < $scope.circles.length; i++) {
                    console.log('------------------');
                    console.log($scope.circles[i].getRadius(), $scope.circles[i].getCenter().lat(), $scope.circles[i].getCenter().lng());
                    console.log('------------------');
                }
            };

            $scope.delete = function () {
                if ($scope.selectedShape) {
                    $scope.deleteSelectedShape();
                }
            }
        }]
    };
}];