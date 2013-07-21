'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('MainCtrl', function ($scope, Restangular) {
		var rTrakt, slug, loadData, putShow;

		// define rest endpoints
		rTrakt = Restangular.all('trakt');

		// init
		$scope.errors = [];
		$scope.shows = [];
		$scope.orderShows = "traktData.completelyCollectedEpisodeCount";
		$scope.orderReverse = true;
		$scope.orderByOptions = [
			{
				label:"Title",
				value:"traktData.title"
			},
			{
				label:"Collected Episode Count",
				value:"traktData.completelyCollectedEpisodeCount"
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

		loadData = function (force, forceSeasons) {
			var params;

			// reset
			$scope.shows = [];

			params = {force:force, forceSeasons:forceSeasons};
			rTrakt.customGET('collection', params).then(function(shows){
				$scope.shows = shows;
			},function(err){
				$scope.shows = undefined;
				$scope.errors.push("Can't fetch shows: " + err.data);
				console.error(err);
			});
		};

		putShow = function (show) {
			var rest;
			rest = Restangular.restangularizeElement(null, show, "show");
			rest.put();
		};

		$scope.hideShow = function (show) {
			console.log("hide show");
			show.hidden = true;
			putShow(show);
		};

		$scope.toggleShow = function (show) {
			console.log("toggle show");
			show.collapsed = !show.collapsed
			putShow(show);
		};

		$scope.reloadData = function () {
			loadData(true);
		};

		$scope.reloadSeasonsData = function () {
			loadData(false, true);
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

		loadData();
	});
})();
