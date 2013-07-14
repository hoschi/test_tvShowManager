'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('MainCtrl', function ($scope, Restangular) {
		var trakt, slug;

		// init
		$scope.errors = [];
		$scope.shows = [];
		$scope.orderBy = "title";
		$scope.orderByOptions = [
			"title",
			"test"
		];

		// TODO save this in session
		$scope.showFilterState = {
			completelyWatched:false,
			watched:false,
			notWatched:false,
			completelyCollected:false,
			collected:true,
			notCollected:true,
			hideEmpty:false
		};

		$scope.linkToTraktSeasonPage = function (baseUrl, season) {
			return baseUrl +
				"/season/" + season;
		};

		$scope.openEpisodeTraktPage = function (baseUrl, season, episode) {
			open(baseUrl +
				"/season/" + season +
				"/episode/" + episode, "_blank");
		};

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
