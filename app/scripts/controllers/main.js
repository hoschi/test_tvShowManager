'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('MainCtrl', function ($scope, Restangular) {
		var trakt;

		// init
		$scope.errors = [];

		// get shows
		trakt = Restangular.all('trakt');

		trakt.customGET('collection').then(function(shows){
			$scope.shows = shows;
		},function(err){
			$scope.shows = undefined;
			$scope.errors.push("Can't fetch shows: " + err.data);
			console.error(err);
		});
	});
})();
