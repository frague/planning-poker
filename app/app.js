/*global angular*/
/*jslint plusplus: true*/

angular.module('planningPoker', [
    'planningPoker.constants',
    'planningPoker.controllers',
    'planningPoker.directives',
    'planningPoker.filters',
    'planningPoker.resources',
    'planningPoker.services',
    'ngResource', 'ngRoute', 'ngAnimate', 'ngAria', 'ngMessages', 'ngMaterial', 'ng.httpLoader', 'ngLodash', 'ngSocket', 'ngCookies', 'ui.gravatar'])

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

    .config(['gravatarServiceProvider', function(gravatarServiceProvider) {
        'use strict';

        gravatarServiceProvider.defaults = {
            size: 50,
            default: 'mm'
        };
    }])

    .config(['$httpProvider', function ($httpProvider) {
        'use strict';

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

    .config(['$routeProvider', 'templatesPath',
             function ($routeProvider, templatesPath) {
                 'use strict';

                 $routeProvider
                     .when('/', {
                         controller: 'indexCtrl',
                         templateUrl: templatesPath + 'welcome.html'
                     })
                     .when('/room/:roomId', {
                         controller: 'gameCtrl',
                         templateUrl: templatesPath + 'room.html'
                     })
                     .otherwise({redirectTo: '/'});
             }])

    .run(['$rootScope', '$location', '$cookies', 'templatesPath',
          function ($rootScope, $location, $cookies, templatesPath) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (!$cookies.get('user') && next.templateUrl !== templatesPath + 'welcome.html') {
                $location.path('/');
            }
        })
    }]);
