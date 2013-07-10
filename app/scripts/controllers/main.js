'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('MainCtrl', function ($scope, Restangular) {
		var trakt;

		trakt = Restangular.all('trakt');

		trakt.customGET('collection').then(function(shows){
			$scope.shows = shows;
		},function(err){
			$scope.shows = undefined;
			console.error(err);
		});
	});
})();
