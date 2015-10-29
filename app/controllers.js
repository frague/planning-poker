/*global angular */
/*global normalizeData, drawCharts */
/*jslint plusplus: true*/

/* Controllers */

angular.module('planningPoker.controllers', [
    'planningPoker.services',
    'planningPoker.filters',
    'planningPoker.constants'
])

    // Template

    .controller('NavCtrl', ['$scope',
                            '$location',
                            'LoginService',
                            'AuthorizationService',
                            function ($scope,
                                      $location,
                                      LoginService,
                                      AuthorizationService) {
            'use strict';

            $scope.logOut = function () {
                LoginService.logOut(function () {
                    AuthorizationService.logOut();
                    $location.path('/home');
                });
            };
        }])

    .controller('AlertsCtrl', ['$scope',
                               'AlertsService',
                               function ($scope,
                                        AlertsService) {
            'use strict';

            $scope.deleteAlert = function (index) {
                AlertsService.deleteAlert(index);
            };

            $scope.getAlerts = function () {
                return AlertsService.getAlerts();
            };
        }])

    // Authentication

    .controller('indexCtrl', ['$scope',
                             '$rootScope',
                             '$location',
                             'LoginService',
                             'AuthorizationService',
                             function ($scope,
                                       $rootScope,
                                       $location,
                                       LoginService,
                                       AuthorizationService) {
            'use strict';

            $scope.error = '';
            $scope.logIn = function () {
                $scope.error = '';
                LoginService.logIn($scope.login,
                                   $scope.password,
                                   $scope.openid,
                                   function (data) {
                        AuthorizationService.getLoggedUser(true, function () {
                            $rootScope.fetchUserData(function () {
                                $location.path('/dashboard');
                            });
                        }, function () {

                        });
                    }, function (resp) {
                        $scope.error = resp.data.error;
                    });
            };
        }])

    .controller('signupCtrl', ['$scope',
                               '$location',
                               'LoginService',
                               function ($scope,
                                        $location,
                                         LoginService) {
            'use strict';

            $scope.save = function () {
                LoginService.signUp($scope.login,
                                    $scope.password,
                                    $scope.email,
                                    function () {
                        $location.path('/dashboard');
                    });
            };
        }]);

