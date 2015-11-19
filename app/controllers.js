/*global angular */
/*jslint plusplus: true*/

/* Controllers */

angular.module('planningPoker.controllers', [
        'planningPoker.services',
        'planningPoker.filters',
        'planningPoker.constants',
        'ngSocket'
    ])

    .controller('indexCtrl', [
        '$scope', '$rootScope', '$location', '$socket', 'lodash', 'RoomService',
        function ($scope, $rootScope, $location, $socket, _, RoomService) {
            'use strict';

            $scope.create = function () {
                RoomService.save(
                    $scope.title, $scope.name,
                    function (res) {
                        $location.path('/room/' + res.room._id);
                    });
            };
        }])

    .controller('gameCtrl', [
        '$scope', '$location', '$routeParams', 'RoomService',
        function ($scope, $location, $routeParams, RoomService) {
            'use strict';

            RoomService.get($routeParams.roomId, function (room) {
                console.log('Room received', room);
                $scope.room = room;
            });

        }]);

