/*global $,angular,window*/
/*global normalizeData,updateData,drawCharts*/

/* Directives */

angular.module('planningPoker.directives', ['planningPoker.services'])
    // Applied to an element makes it fade out after 10 secs
    .directive('washAway', function () {
        'use strict';

        return function (scope, element, attrs) {
            scope.$watch(attrs.washAway, function () {
                element.delay(10000).fadeOut(1000);
            });
        };
    })

    .directive('dateSelector', function () {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).datepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    todayHighlight: true
                });

                attrs.$observe('dateSelector', function (v) {
                    $(element).datepicker('update', v);
                });
            }
        };
    })

    // Makes link clicked display confirmation
    .directive('confirmedClick', function () {
        'use strict';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    if (window.confirm(attrs.confirmation)) {
                        scope.$eval(attrs.confirmedClick);
                    }
                });
            }
        };
    })

    // Catches keyup events on the element
    .directive('ngKeyup', function () {
        'use strict';

        return function (scope, element, attrs) {
            element.bind('keyup', function (event) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngKeyup)(event);
                });
                event.preventDefault();
            });
        };
    })

    // Two form fields equality validator
    .directive('equals', function () {
        'use strict';

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }

                var validate = function () {
                    var checkEmpty = function (value) {
                        return typeof value === 'undefined' ? '' : value;
                    },
                        val1 = checkEmpty(ngModel.$viewValue),
                        val2 = checkEmpty(attrs.equals);

                    ngModel.$setValidity('equals', val1 === val2);
                };

                scope.$watch(attrs.ngModel, function () {
                    validate();
                });

                attrs.$observe('equals', function () {
                    validate();
                });
            }
        };
    })

    // Makes table header clickable and content sortable
    .directive('sortColumn', function ($compile) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                sort: '=',
                sortColumn: '&'
            },
            link: function compile(scope, element) {
                var h = '<a href ng-click="scream()">' + element.text() + '</a><i class="fa" ng-show="isSelected()" ng-class="{true:\'fa-sort-desc\', false:\'fa-sort-asc\'}[sort.desc]"></i>',
                    content = angular.element('<div></div>').html(h).contents(),
                    compiled = $compile(content);

                element.html('');
                element.append(content);
                element.addClass('sorted');

                scope.desc = false;

                scope.isSelected = function () {
                    return scope.sort && scope.sort.column === scope.sortColumn();
                };

                scope.scream = function () {
                    if (scope.isSelected()) {
                        scope.sort.desc = !scope.sort.desc;
                    } else {
                        scope.sort = {column: scope.sortColumn(), desc: false};
                    }
                };

                compiled(scope);
            }
        };
    })

    .directive('checkbox', function () {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            scope: {
                value: '=ngModel'
            },
            link: function (scope, element, attrs, ngModel) {
                scope.toggle = function () {
                    ngModel.$setViewValue(!scope.value);
                };
            },
            template: '<button ng-click="toggle()" class="btn-checkbox"><i ng-class="value ? \'fa fa-check-square\' : \'fa fa-square\'"></i></button>'
        };
    });
