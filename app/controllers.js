/*global angular */
/*jslint plusplus: true*/

/* Controllers */

angular.module('planningPoker.controllers', [
        'planningPoker.services',
        'planningPoker.filters',
        'planningPoker.constants'
    ])

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

