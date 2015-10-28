'use strict';

var poker = angular.module(
	'planningPoker', [
		'ngRoute',
		'planningPoker.home',
		'planningPoker.about',
		'planningPoker.login'
	]);

poker.config(function($routeProvider, $locationProvider, $httpProvider) {

	$routeProvider.otherwise({ redirectTo: '/'});

	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	// disabling # in Angular urls
	// $locationProvider.html5Mode({
	// 		enabled: true,
	//      requireBase: false
	// });
});
