/*global angular, jQuery*/
/*jslint plusplus: true*/

angular.module('planningPoker.resources', [])
    .factory('RoomResource', ['$resource', 'endpoint', function ($resource, endpoint) {
        'use strict';
        return $resource(endpoint + '/rooms/:roomId');
    }])

    .factory('UserStoryResource', ['$resource', 'endpoint', function ($resource, endpoint) {
        'use strict';
        return $resource(endpoint + '/stories/:storyId');
    }]);
