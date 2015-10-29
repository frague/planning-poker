/* Filters */

angular.module('planningPoker.filters', [])

    .filter('capitalize', function() {
        'use strict';

        return function(input, scope) {
            if (input !== null)
                input = input.toLowerCase();
            return input.substring(0,1).toUpperCase() + input.substring(1);
        };
    })

    .filter('time', function() {
        'use strict';

        return function(input, scope) {
            input = 1 * input;
            var minutes = Math.floor(input / 60);
            var seconds = input - 60 * minutes;
            return minutes;
        };
    })

    .filter('redate', function() {
        'use strict';

        return function(s, reverse) {
            if (s.length != 8 || !/^\d{8}$/.test(s)) return s;
            if (reverse) return s.substr(0, 2) + '-' + s.substr(2, 2) + '-' + s.substr(4, 4);
            return s.substr(0, 4) + '-' + s.substr(4, 2) + '-' + s.substr(6, 2);
        };
    })

    .filter('or', function() {
        'use strict';

        return function(input, alt) {
            return input ? input : alt;
        };
    })

    .filter('percentOf', function() {
        'use strict';

        return function(current, total, reverse) {
            var p = Math.round(current * 100 / total);
            return reverse ? 100 - p : p;
        };
    })

    .filter('twoDigits', function() {
        'use strict';

        return function(float) {
            return (1 * float).toFixed(2);
        };
    })

    .filter('leadingZero', function() {
        'use strict';

        return function(i) {
            return i > 9 ? i : '0' + i;
        };
    })

    .filter('range', function() {
        'use strict';

        return function(input, start, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++) input.push(start + i);
            return input;
        };
    })

    .filter('monthYear', ['months', 'monthsFrom', function(months, monthsFrom) {
        'use strict';

        return function(d, isTill) {
            if (d && d.getMonth) return (isTill ? months : monthsFrom)[d.getMonth()].toLowerCase() + ' ' + d.getFullYear();
            return '';
        };
    }])

    .filter('nl', function() {
        'use strict';

        return function(input) {
            if (!input) return '';
            return input.split('\n');
        };
    })

    .filter('countable', function () {
        'use strict';

        return function(input, ts, tsa, tsev) {
            var stringed = ('' + input),
                isEleven = stringed === '11',
                last = parseInt(stringed.substr(-1));
            if (isNaN(last)) return '';
            if ([5, 6, 7, 8, 9, 0].indexOf(last) >= 0 || isEleven) return tsev;
            if (last === 1) return ts;
            return tsa;
        };
    });
