/*global angular */
/*jslint plusplus: true*/

/* Controllers */

angular.module('planningPoker.controllers', [
        'planningPoker.services',
        'planningPoker.filters',
        'planningPoker.constants'
    ])

    .controller('indexCtrl', [
        '$scope', '$rootScope', '$location', 'lodash',
        function ($scope, $rootScope, $location, _) {
            'use strict';

            $scope.create = function () {
//                LoginService.logIn($scope.login,
//                                   $scope.password,
//                                   $scope.openid,
//                                   function (data) {
//                        AuthorizationService.getLoggedUser(true, function () {
//                            $rootScope.fetchUserData(function () {
//                                $location.path('/dashboard');
//                            });
//                        }, function () {
//
//                        });
//                    }, function (resp) {
//                        $scope.error = resp.data.error;
//                    });
                $rootScope.gameId = _.times(16, function () {
                    return String.fromCharCode(_.random(0, 1) ? _.random(48, 57) : _.random(65, 90));
                }).join('');
                console.log($rootScope.gameId);

            };
        }])

    .controller('gameCtrl', ['$scope',
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

