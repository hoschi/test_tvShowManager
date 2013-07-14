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
				return show &&
					(filterState.hideEmpty && show.empty === false ||
					filterState.hideEmpty === false) &&

					((filterState.completelyWatched && show.completelyWatched === filterState.completelyWatched) ||
					(filterState.watched && show.watched === filterState.watched && show.completelyWatched === false) ||
					(filterState.watched === false && filterState.completelyWatched === false)) &&

					((filterState.completelyCollected && show.completelyCollected === filterState.completelyCollected) ||
					(filterState.collected && show.collected === filterState.collected && show.completelyCollected === false) ||
					(filterState.collected === false && filterState.completelyCollected === false));
			});
		};
	});
})();

