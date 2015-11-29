/*global angular, jQuery*/
/*jslint plusplus: true*/

/* Services */

angular.module('planningPoker.services', ['planningPoker.resources'])

    .factory('RoomService', [
        'RoomResource',
        function (RoomResource) {
            'use strict';

            return {
                get: function (roomId, callback, errback) {
                    return RoomResource.get({roomId: roomId}, {}, callback, errback);
                },
                save: function (title, ownerName, email, callback, errback) {
                    return RoomResource.save(
                        {}, {title: title, owner: ownerName, email: email}, callback, errback
                    );
                }
            };
    }])
    .factory('UserStoryService', [
        'UserStoryResource',
        function (UserStoryResource) {
            'use strict';

            return {
                get: function (storyId, callback, errback) {
                    return UserStoryResource.get({storyId: storyId}, {}, callback, errback);
                },
                save: function (storyId, userStory, callback, errback) {
                    return UserStoryResource.save(
                        {storyId: storyId}, userStory, callback, errback
                    );
                },
                delete: function (storyId, callback, errback) {
                    return UserStoryResource.delete(
                        {storyId: storyId}, {}, callback, errback
                    );
                }
            };
        }]);
