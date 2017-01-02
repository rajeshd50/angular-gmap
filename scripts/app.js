'use strict';
window.angular.module('GmapApp', [
    'ngAnimate',
	'ui.router',
	require('./modules').name
]);

 function bootstrapApplication() {
     angular.element(document).ready(function() {
         angular.bootstrap(document, ["GmapApp"]);
     });
 }
 bootstrapApplication();