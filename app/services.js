/*global angular, jQuery*/
/*jslint plusplus: true*/

/* Services */

angular.module('planningPoker.services', ['planningPoker.resources'])

    .factory('RoomService', [
        '$rootScope', 'RoomResource',
        function ($rootScope, RoomResource) {
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
        }]);
