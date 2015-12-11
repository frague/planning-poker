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

    .controller('StoryDialogCtrl', [
        '$scope', '$mdDialog', 'oldStory', 'roomId', 'UserStoryService', 'lodash',
        function ($scope, $mdDialog, oldStory, roomId, UserStoryService, _) {

        $scope.oldStory = oldStory || {};
        $scope.oldStory.roomId = roomId;
        $scope.story = _.clone($scope.oldStory);
        $scope.error = null;

        console.log(oldStory, roomId, $scope.story);

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function(story) {
            UserStoryService.save(story._id, story, function () {
                $mdDialog.hide();
            }, function () {
                $scope.error = 'Error saving user story information';
            })
        };
    }])

    .controller('gameCtrl', [
    '$scope', '$location', '$routeParams', '$socket', '$cookies', 'lodash',
    '$mdDialog', '$mdMedia', 'UserStoryService', 'RoomService', 'templatesPath',
    function ($scope, $location, $routeParams, $socket, $cookies, _,
               $mdDialog, $mdMedia, UserStoryService, RoomService, templatesPath) {
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
            if (!$scope.data.stories || $scope.data.stories.length <= storyIndex) return '-';
            return $scope.data.stories[storyIndex].title;
        };

        $scope.addUserStory = function(oldStory) {
            $mdDialog.show({
                controller: 'StoryDialogCtrl',
                templateUrl: templatesPath + 'story_dialog.html',
                openFrom: '#edit-story',
                clickOutsideToClose: true,
                locals: {
                    oldStory: oldStory,
                    roomId: roomId
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
