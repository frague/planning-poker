/*global angular */
/*jslint plusplus: true*/

/* Controllers */

angular.module('planningPoker.controllers', [
        'planningPoker.services',
        'planningPoker.filters',
        'planningPoker.constants',
        'ngSocket',
        'ngCookies'
    ])

    .controller('indexCtrl', [
        '$scope', '$rootScope', '$location', '$cookies', 'lodash', 'RoomService',
        function ($scope, $rootScope, $location, $cookies, _, RoomService) {
            'use strict';

            $scope.create = function () {
                RoomService.save(
                    $scope.title, $scope.name, $scope.email,
                    function (res) {
                        $cookies.putObject('user', res.user);
                        $location.path('/room/' + res.room._id);
                    });
            };
        }])

    .controller('gameCtrl', [
        '$scope', '$location', '$routeParams', '$socket', '$cookies', 'RoomService',
        function ($scope, $location, $routeParams, $socket, $cookies, RoomService) {
            'use strict';

            var roomId = $routeParams.roomId;

            $scope.room = null;
            $socket.emit('join', {roomId: roomId});

            $scope.user = $cookies.getObject('user');
            console.log(JSON.stringify($scope.user));

            RoomService.get(roomId, function (room) {
                $scope.room = room;
                $socket.on('pong', $scope, function (data) {
                    $scope.users = data.users;
                });
            }, function () {
                // Unable to fetch room
            });


        }]);

