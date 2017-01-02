'use strict';

module.exports =
    window.angular.module('StarterApp.modules', [	
    ])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function(
            $stateProvider,
            $urlRouterProvider,
            $locationProvider
        ) {
            $urlRouterProvider.when('/', '/home');
            $urlRouterProvider.when('', '/home');
            $urlRouterProvider.otherwise('/404');

            $locationProvider.hashPrefix('!');
            
            // $locationProvider.html5Mode(true);
            
            $stateProvider
            .state('app',{
                url:'/app',
                abstract: true,
                template: require('./templates/abstract-template.html'),
                controller: 'abstractCtl',
                controllerAs: 'vm'
            })
            .state('app.home', {
                url: '^/home',
                template: require('./templates/home.html'),
                controller: 'homeCtl',
                controllerAs: 'vm'
            });
        }
    ])
    .directive('gmapDir',require('./directives/gmap-dir'))
    .controller('abstractCtl',require('./controllers/abstract-ctl'))
    .controller('homeCtl',require('./controllers/home.ctrl'));