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
				return show && (show.completelyWatched === filterState.completelyWatched ||
					show.watched === filterState.watched ||
					show.completelyCollected === filterState.completelyCollected ||
					show.collected === filterState.collected ||
					show.empty !== filterState.empty);
			});
		};
	});
})();

