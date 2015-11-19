/*global angular*/
/*jslint plusplus: true*/

angular.module('planningPoker', [
    'planningPoker.constants',
    'planningPoker.controllers',
    'planningPoker.directives',
    'planningPoker.filters',
    'planningPoker.resources',
    'planningPoker.services',
    'ngResource', 'ngRoute', 'ngAnimate', 'ngAria', 'ngMessages', 'ngMaterial', 'ng.httpLoader', 'ngLodash', 'ngSocket'])

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
//            .backgroundPalette('light-green')
            .primaryPalette('grey')
            .warnPalette('deep-orange');
    })

    .config([
        'httpMethodInterceptorProvider',
        function (httpMethodInterceptorProvider) {
        'use strict';

            httpMethodInterceptorProvider.whitelistDomain('');
        }
    ])

    .config(['$httpProvider', function ($httpProvider) {
        'use strict';

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

    .config(['$locationProvider', '$routeProvider', 'templatesPath',
             function ($locationProvider, $routeProvider, templatesPath) {
                 'use strict';

                 $routeProvider
                     .when('/', {
                         controller: 'indexCtrl',
                         templateUrl: templatesPath + '/welcome.html'
                     })
                     .when('/room/:roomId', {
                         controller: 'gameCtrl',
                         templateUrl: templatesPath + '/room.html'
                     })
                     .otherwise({redirectTo: '/'});
             }]);
