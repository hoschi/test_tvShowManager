'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('MainCtrl', function ($scope, Restangular) {
		var trakt, slug;

		// init
		$scope.errors = [];
		$scope.shows = [];
		$scope.orderShows = "completelyCollectedEpisodeCount";
		$scope.orderReverse = true;
		$scope.orderByOptions = [
			{
				label:"Title",
				value:"title"
			},
			{
				label:"Collected Episode Count",
				value:"completelyCollectedEpisodeCount"
			}
		];

		// TODO save this in session
		$scope.showFilterState = {
			completelyWatched:false,
			watched:true,
			notWatched:true,
			completelyCollected:true,
			collected:true,
			notCollected:false,
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
