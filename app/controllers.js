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
    '$scope', '$location', '$routeParams', '$socket', 'lodash', '$mdDialog', '$mdMedia', 'RoomService', 'templatesPath',
    function ($scope, $location, $routeParams, $socket, _, $mdDialog, $mdMedia, RoomService, templatesPath) {
        'use strict';

        $scope.data = {};
        $scope.customFullscreen = $mdMedia('sm');
        $scope.user = $cookies.getObject('user');

        var roomId = $routeParams.roomId,
            storyIndex = 0,
            updateGame = function (gameData) {
                if (gameData.roles) {
                    $scope.roles = gameData.roles.reduce(function (rolesDict, role) {
                        rolesDict[role._id] = role.title;
                        return rolesDict;
                    }, {});
                };
                ['room', 'users', 'stories', 'votes'].forEach(function (key) {
                    if (gameData.hasOwnProperty(key)) {
                        $scope.data[key] = gameData[key];
                    }
                });
            };

        $socket.emit('join', {roomId: roomId});
        updateGame({});

        RoomService.get(roomId, function (data) {
            updateGame(data);
            $socket.on('update', $scope, function (data) {
                updateGame(data);
            });
        }, function () {
            // Unable to fetch room
        });

        $scope.getCurrentStory = function () {
            if (!$scope.data.stories || $scope.stories.lenght < storyIndex) return '-';
            return $scope.stories[storyIndex];
        };

        function StoryDialogCtrl($scope, $mdDialog, oldStory) {
            $scope.oldStory = oldStory;
            $scope.story = _.clone(oldStory);

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.save = function(story) {
                console.log(story);
//                $mdDialog.hide($scope.title, $scope.description);
            };
        };

        $scope.addUserStory = function(oldStory) {
            $mdDialog.show({
                controller: StoryDialogCtrl,
                templateUrl: templatesPath + 'story_dialog.html',
//                parent: angular.element(document.body),
                openFrom: '#edit-story',
                clickOutsideToClose: true,
                locals: {
                    oldStory: oldStory
                },
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
            .then(function(title, description) {
                // Story creation logic
            }, function() {
                // Cancel
            });

            $scope.$watch(function () {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });
        };
    }]);
