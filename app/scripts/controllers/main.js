'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('MainCtrl', function ($scope, $timeout, Restangular, progressbar) {
		var rTrakt, loadData, putShow;

		// define rest endpoints
		rTrakt = Restangular.all('trakt');

		// init
		$scope.errors = [];
		$scope.shows = [];
		$scope.orderShowsFirst = "traktData.continuouslyCollectedPercent";
		$scope.orderShowsSecond = "traktData.completelyCollectedEpisodeCount";
		$scope.orderReverse = true;
		$scope.orderByOptions = [
			{
				label:"None",
				value:null
			},
			{
				label:"Title",
				value:"traktData.title"
			},
			{
				label:"Episode Count",
				value:"traktData.episodeCount"
			},
			{
				label:"Collected Episode Count",
				value:"traktData.completelyCollectedEpisodeCount"
			},
			{
				label:"Watched Percent",
				value:"traktData.watchedPercent"
			},
			{
				label:"Collected Percent",
				value:"traktData.collectedPercent"
			},
			{
				label:"Continuously Collected Percent",
				value:"traktData.continuouslyCollectedPercent"
			}
		];

		// TODO save this in session
		$scope.showFilterState = {
			completelyWatched:false,
			watched:true,
			notWatched:true,
			completelyCollected:true,
			collected:false,
			continuous:true,
			notCollected:false,
			hideEmpty:false
		};

		loadData = function (force, forceSeasons) {
			var params;

			// reset
			$scope.shows = [];

			// start animation
			progressbar.start();

			params = {force:force, forceSeasons:forceSeasons};
			rTrakt.customGET('collection', params).then(function(shows){
				$scope.shows = shows;

				if (shows.length <= 0) {
					progressbar.complete();
				}
			},function(err){
				$scope.shows = undefined;
				$scope.errors.push("Can't fetch shows: " + err.data);
				console.error(err);
				progressbar.complete();
			});
		};

		$scope.$on('finishedShowRepeat', function() {
			progressbar.complete();
		});

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
			show.collapsed = !show.collapsed;
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

		$scope.openPage = function (url) {
			open(url);
		};

		$scope.openEpisodeTraktPage = function (baseUrl, season, episode) {
			$scope.openPage(baseUrl +
				"/season/" + season +
				"/episode/" + episode, "_blank");
		};

		loadData();
	});
})();
