/*global angular, jQuery*/
/*jslint plusplus: true*/

angular.module('planningPoker.resources', [])
    .factory('LoginResource', ['$resource', 'endpoint', function ($resource, endpoint) {
        'use strict';

        return $resource(endpoint + '/:verb/:token', {}, {
            logIn:          {method: 'POST', params: {verb: 'login'}},
            logOut:         {method: 'POST', params: {verb: 'logout'}},
            resetPassword:  {method: 'POST', params: {verb: 'reset'}},
            signUp:         {method: 'POST', params: {verb: 'signup'}}
        });
    }])

    .factory('UserResource', ['$resource', 'endpoint', function ($resource, endpoint) {
        'use strict';

        return $resource(endpoint + '/users/:userId', {}, {
        });
    }])

    .factory('DayResource', ['$resource', 'endpoint', function ($resource, endpoint) {
        'use strict';

        return $resource(endpoint + '/days/:goalId/:year', {}, {
            digest:         {method: 'GET', isArray: false, params: {}}
        });
    }])

    .factory('GoalResource', ['$resource', 'endpoint', function ($resource, endpoint) {
        'use strict';

        return $resource(endpoint + '/goals/:userId/:goalId', {goalId: '@id'}, {
        });
    }]);
