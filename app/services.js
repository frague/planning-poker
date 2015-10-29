/*global angular, jQuery*/
/*jslint plusplus: true*/

/* Services */

angular.module('planningPoker.services', ['planningPoker.resources'])

    .factory('AlertsService', ['$rootScope', function ($rootScope) {
        'use strict';

        var AlertClass = Object.freeze({
            Error: 'danger',
            Info: 'info',
            Success: 'success',
            Warn: 'warning'
        }),
            alerts = [],
            insertAlert = function (alertClass, alertMessage) {
                alerts.push({
                    alertClass: alertClass,
                    alertMessage: alertMessage
                });
            },
            insertErrorAlert = function (alertMessage) {
                alerts.push({
                    alertClass: AlertClass.Error,
                    alertMessage: alertMessage
                });
            },
            insertInfoAlert = function (alertMessage) {
                alerts.push({
                    alertClass: AlertClass.Info,
                    alertMessage: alertMessage
                });
            },
            insertSuccessAlert = function (alertMessage) {
                alerts.push({
                    alertClass: AlertClass.Success,
                    alertMessage: alertMessage
                });
            },
            insertWarnAlert = function (alertMessage) {
                alerts.push({
                    alertClass: AlertClass.Warn,
                    alertMessage: alertMessage
                });
            };

        $rootScope.$on('AlertService.Success', function (event, text) {
            insertSuccessAlert(text);
        });

        $rootScope.$on('AlertService.Error', function (event, data) {
            insertErrorAlert(data.data.error ||
                             data.data.message ||
                             'Something went wrong...');
        });

        $rootScope.$on('LoginService.resetPasswordSuccess', function (event, data) {
            insertSuccessAlert(data.alertMessage);
        });

        $rootScope.$on('LoginService.logOutSuccess', function (event, data) {
            insertSuccessAlert(data.alertMessage);
        });

        $rootScope.$on('LoginService.signUpSuccess', function (event, data) {
            insertSuccessAlert(data.alertMessage);
        });

        return {
            deleteAlert: function (index) {
                alerts.splice(index, 1);
            },
            getAlerts: function () {
                return alerts;
            }
        };
    }])

    .factory('PagesTreeService', ['$location',
                                  'templatesPath',
                                  'internalPages',
                                  'externalPages',
                                  function ($location,
                                           templatesPath,
                                           internalPages,
                                           externalPages) {
            'use strict';

            var pageIsIn = function (next, list) {
                var value = next.templateUrl.
                    replace(templatesPath, '').
                    replace('.html', '');
                return jQuery.inArray(value, list) >= 0;
            };
            return {
                getPath: function () {
                    var path = $location.path().replace('/^(\/[^\/]+)([\/?].*)$/', '$1');
                    return {templateUrl: path};
                },
                isInternal: function (next) {
                    var result = pageIsIn(next, internalPages);
                    return result;
                },
                isExternal: function (next) {
                    var result = pageIsIn(next, externalPages);
                    return result;
                }
            };
        }])

    .factory('AuthorizationService', ['$rootScope',
                                      'LoginService',
                                      'CallbackService',
                                      function ($rootScope,
                                                LoginService,
                                                CallbackService) {
            'use strict';

            var Authorization = Object.freeze({
                NotLogged: {
                    id: '',
                    name: '',
                    email: '',
                    login: ''
                }
            }),
                loggedUser = Authorization.NotLogged,
                isUserAuthorized = function () {
                    return loggedUser !== Authorization.NotLogged;
                };

            return {
                getLoggedUser: function (force, success_callback, error_callback) {
                    if (!force) {
                        CallbackService.success(success_callback)(loggedUser);
                        return loggedUser;
                    }
                    return LoginService.me(function (data) {
                        loggedUser = data;
                        CallbackService.success(success_callback)(data);
                        return data;
                    }, CallbackService.error(error_callback));
                },
                isAuthorized: function () {
                    return isUserAuthorized();
                },
                logOut: function () {
                    loggedUser = Authorization.NotLogged;
                }
            };
        }])

    .factory('CallbackService', ['$rootScope', function ($rootScope) {
        'use strict';

        return {
            success: function (callback) {
                return callback || function (data) {
                    return data;
                };
            },
            error: function (callback) {
                return callback || function (data) {
                    $rootScope.$emit('requestError', data);
                };
            }
        };
    }])

    .factory('LoginService', ['$rootScope',
                              'LoginResource',
                              'UserResource',
                              'CallbackService',
                              function ($rootScope,
                                        LoginResource,
                                        UserResource,
                                        CallbackService) {
            'use strict';

            return {
                me: function (success_callback, error_callback) {
                    return UserResource.get(
                        {userId: 'me'},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                logIn: function (login, password, openid, success_callback, error_callback) {
                    return LoginResource.logIn(
                        {},
                        {login: login, password: password, openid: openid},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                logOut: function (success_callback, error_callback) {
                    return LoginResource.logOut(
                        {},
                        {},
                        function (data) {
                            $rootScope.$emit('LoginService.logOutSuccess', {alertMessage: 'Thanks for visiting!'});
                            CallbackService.success(success_callback)(data);
                        },
                        CallbackService.error(error_callback)
                    );
                },
                signUp: function (login, password, email, success_callback, error_callback) {
                    return LoginResource.signUp(
                        {},
                        {login: login, password: password, email: email},
                        function (data) {
                            $rootScope.$emit('LoginService.signUpSuccess', {alertMessage: 'Поздравляем, вы зарегистрированы в системе'});
                            CallbackService.success(success_callback)(data);
                        },
                        CallbackService.error(error_callback)
                    );
                },
                signUpConfirm: function (registration_code) {
                    var data = LoginResource.signUpConfirm(
                        {},
                        {code: registration_code},
                        function () {
                            $rootScope.$emit('LoginService.signUpConfirmSuccess', {alertMessage: 'Your registration confirmed!', authorization: data.auth_token});
                        },
                        CallbackService.error()
                    );
                },
                resetPassword: function (email) {
                    return LoginResource.resetPassword(
                        {},
                        {email: email},
                        function (data) {
                            $rootScope.$emit('LoginService.resetPasswordSuccess', {alertMessage: 'An email has been sent to ' + email + '!'});
                        },
                        CallbackService.error()
                    );
                }
            };
        }])

    .factory('DayService', ['CallbackService',
                            'DayResource',
                            function (CallbackService,
                                      DayResource) {
            'use strict';

            var makeDateId = function (d) {
                if (!d) {
                    return '';
                }
                return +(d.getFullYear() + ('0' + (1 + d.getMonth())).substr(-2, 2) + ('0' + d.getDate()).substr(-2, 2));
            },
                empty_states = new Array(32).join('0'),
                check_empty = function (data, goal_id, year, month) {
                    if (!data.hasOwnProperty(goal_id)) {
                        data[goal_id] = {};
                    }
                    if (!data[goal_id].hasOwnProperty(year)) {
                        data[goal_id][year] = {};
                    }
                    if (!data[goal_id][year].hasOwnProperty(month)) {
                        data[goal_id][year][month] = empty_states;
                    }
                };

            return {
                get: function (goalId, year, success_callback, error_callback) {
                    return DayResource.get(
                        {year: year, goalId: goalId},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                digest: function (year, month, success_callback, error_callback) {
                    return DayResource.digest(
                        {year: year, goalId: month},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                save: function (date, goalId, state, success_callback, error_callback) {
                    return DayResource.save(
                        {year: date, goalId: goalId},
                        {state: state},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                calc: function (date) {
                    if (!date || !date.setDate) {
                        return;
                    }

                    var d = new Date(date.getTime()),
                        firstDay,
                        weeks;
                    d.setDate(1);
                    firstDay = (6 + d.getDay()) % 7;

                    d.setMonth(d.getMonth() + 1);
                    d.setDate(-1);
                    d = d.getDate() + 1;

                    weeks = Math.ceil((firstDay + d) / 7);
                    return {
                        firstDay: firstDay,
                        days: d,
                        weeks: weeks,
                        size: d + firstDay,
                        currentDate: makeDateId(new Date())
                    };
                },
                makeId: function (d) {
                    return makeDateId(d);
                },
                empty_states: empty_states,
                fill_year: function (data, goal_id, year) {
                    var i;
                    for (i = 1; i <= 12; i++) {
                        check_empty(data, goal_id, year, i);
                    }
                },
                fill_digest: function (data, goals, year, month) {
                    var i, l;
                    for (i = 0, l = goals.length; i < l; i++) {
                        check_empty(data, goals[i].id, year, month);
                    }
                }
            };
        }])

    .factory('GoalService', ['CallbackService',
                             'GoalResource',
                             function (CallbackService,
                                       GoalResource) {
            'use strict';

            return {
                get: function (userId, goalId, success_callback, error_callback) {
                    return GoalResource.get(
                        {userId: userId, goalId: goalId},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                query: function (userId, success_callback, error_callback) {
                    return GoalResource.query(
                        {userId: userId},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                save: function (userId, goal, success_callback, error_callback) {
                    return GoalResource.save(
                        {userId: userId},
                        goal,
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                delete: function (userId, goalId, success_callback, error_callback) {
                    return GoalResource.delete(
                        {userId: userId, goalId: goalId},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                }
            };
        }])

    .factory('UserService', ['CallbackService',
                             'UserResource',
                             function (CallbackService,
                                       UserResource) {
            'use strict';

            return {
                get: function (userId, success_callback, error_callback) {
                    return UserResource.get(
                        {userId: userId},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                query: function (success_callback, error_callback) {
                    return UserResource.query(
                        {},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                save: function (user, success_callback, error_callback) {
                    return UserResource.save(
                        {},
                        user,
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                },
                delete: function (userId, success_callback, error_callback) {
                    return UserResource.delete(
                        {userId: userId},
                        {},
                        CallbackService.success(success_callback),
                        CallbackService.error(error_callback)
                    );
                }
            };
        }]);
