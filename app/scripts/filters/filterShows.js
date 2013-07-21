'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.filter('filterShows', function () {
		return function (shows, filterState) {
			if (!shows) {
				console.error("Shows undefined, can't filter", filterState);
				return shows;
			}

			if (!filterState) {
				console.error("Filter state object undefined, can't filter", shows.length);
				return shows;
			}

			return shows.filter(function (show) {

			    if (!show) {
			        console.log(show);
			    }
				return show && show.traktData &&
					(filterState.hideEmpty && show.traktData.empty === false ||
					filterState.hideEmpty === false) &&

					(
						(filterState.completelyWatched && show.traktData.completelyWatched === filterState.completelyWatched) ||
						(filterState.watched && show.traktData.watched === filterState.watched && show.traktData.completelyWatched === false) ||
						(filterState.notWatched && show.traktData.completelyWatched === false && show.traktData.watched === false) ||
						(filterState.watched === false && filterState.completelyWatched === false && filterState.notWatched === false)
					) &&

					(
						(filterState.completelyCollected && show.traktData.completelyCollected === filterState.completelyCollected) ||
						(filterState.collected && show.traktData.collected === filterState.collected && show.traktData.completelyCollectedEpisodeCount > 0 && show.traktData.completelyCollected === false) ||
						(filterState.notCollected && show.traktData.completelyCollected === false && show.traktData.collected === false) ||
						(filterState.collected === false && filterState.completelyCollected === false && filterState.notCollected === false)
					);
			});
		};
	});
})();

