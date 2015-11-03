/*global angular*/
/*jslint plusplus: true*/

angular.module('planningPoker', [
    'planningPoker.constants',
    'planningPoker.controllers',
    'planningPoker.directives',
    'planningPoker.filters',
    'planningPoker.resources',
    'planningPoker.services',
    'ngResource', 'ngRoute', 'ngAnimate', 'ngAria', 'ngMessages', 'ngMaterial', 'ng.httpLoader'])

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
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
                     .when('/signup', {
                     controller: 'SignupCtrl',
                     templateUrl: templatesPath + '/signup.html'
                 })
                     .when('/dashboard', {
                     controller: 'DashboardCtrl',
                     templateUrl: templatesPath + '/dashboard.html'
                 })
                     .when('/digest', {
                     controller: 'DigestCtrl',
                     templateUrl: templatesPath + '/digest.html'
                 })
                     .when('/users', {
                     controller: 'UsersCtrl',
                     templateUrl: templatesPath + '/users.html'
                 })
                     .when('/users/:userId', {
                     controller: 'UserCtrl',
                     templateUrl: templatesPath + '/user.html'
                 })
                     .otherwise({redirectTo: '/home'});
             }])

    .run(['$rootScope',
          '$location',
          'AuthorizationService',
          'PagesTreeService',
          function ($rootScope,
                     $location,
                     AuthorizationService,
                     PagesTreeService) {

              'use strict';

              $rootScope.isAuthorized = function () {
                  return AuthorizationService.isAuthorized();
              };

              $rootScope.getLoggedUser = function () {
                  return AuthorizationService.getLoggedUser(false);
              };

              $rootScope.isAdmin = function () {
                  return ($rootScope.isAuthorized() && $rootScope.getLoggedUser().role === 'admin');
              };

              $rootScope.checkLocation = function (l) {
                  AuthorizationService.getLoggedUser(false, function () {
                      if ($rootScope.isAuthorized()) {
                          // Pages restricted for logged in user
                          if (!PagesTreeService.isInternal(l)) {
                              $location.path('/dashboard');
                          }
                      } else {
                          // Pages restricted for not logged in user
                          if (!PagesTreeService.isExternal(l)) {
                              $location.path('/home');
                          }
                      }
                  });
              };
          }])

    .run(['$location',
          '$rootScope',
          'AuthorizationService',
          'PagesTreeService',
          'GoalService',
          function ($location,
                     $rootScope,
                     AuthorizationService,
                     PagesTreeService,
                     GoalService) {

              'use strict';

              $rootScope.$on('requestError', function (event, data) {
                  if (data && data.status) {
                      switch (data.status) {
                          case 401:   // Not authorized
                              $rootScope.logOut();
                              if (!PagesTreeService.isExternal(PagesTreeService.getPath())) {
                                  $location.path('/home');
                              }
                              break;
                          default:
                              $rootScope.$emit('AlertService.Error', data);
                      }
                  }
              });
          }]);
