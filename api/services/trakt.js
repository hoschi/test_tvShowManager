var trakt, request, _;

request = require('request');
_ = require('lodash');

trakt = {
	settings:{
		traktUsername:"",
		traktPassword:"",
		traktApiKey:""
	},
	cache:{
	}
};

trakt.getCached = function (key, force) {
	var data;

	data = this.cache[key];
	if (force || !data) {
		return null;
	}

	console.log("Return cached data for key: " + key);
	return data;
};

trakt.createTransformer = function (callback, key) {
	return _.partial(_.bind(this.transformResponse, this), callback, key);
};

trakt.transformResponse = function (callback, key, err, resp, body) {
	var json;
	if (err) return callback(err);

	json = JSON.parse(body);
	if (json.error) {
		return callback(json.error);
	}

	// save data in cache
	this.cache[key] = json;

	console.log("fetched data for key " + key);

	return callback(null, json);
}

trakt.getAllShows = function (callback, force) {
	var url, cache, key;

	key = "getAllShows";
	data = this.getCached(key, force);
	if (data) {
		return callback(null, data);
	}

	url = 'http://api.trakt.tv/user/library/shows/all.json';
	url += '/' + this.settings.traktApiKey;
	url += '/' + this.settings.traktUsername;

	request.get(url, {
		'auth': {
			'user': this.settings.traktUsername,
			'pass': this.settings.traktPassword,
		}
	}, this.createTransformer(callback, key));
	//
	// this is only for development purposes
/*
 *    }, this.createTransformer(_.bind(function (err, data) {
 *        if (err) return callback(err);
 *
 *        newData = data.filter(function (show) {
 *            return show.title === "7 Days" ||
 *                    show.title === "Alphas" ||
 *                    show.title === "The A-Team" ||
 *                    show.title === "The West Wing";
 *        });
 *        this.cache[key] = newData;
 *        callback(null, newData);
 *    }, this), key));
 */
};

trakt.getCollection = function (callback, force) {
	var url, cache, key;

	key = "getCollection";
	data = this.getCached(key, force);
	if (data) {
		return callback(null, data);
	}

	url = 'http://api.trakt.tv/user/library/shows/collection.json';
	url += '/' + this.settings.traktApiKey;
	url += '/' + this.settings.traktUsername;

	request.get(url, {
		'auth': {
			'user': this.settings.traktUsername,
			'pass': this.settings.traktPassword,
		}
	}, this.createTransformer(callback, key));
};

trakt.getWatchedShows = function (callback, force) {
	var url, cache, key;

	key = "getWatchedShows";
	data = this.getCached(key, force);
	if (data) {
		return callback(null, data);
	}

	url = 'http://api.trakt.tv/user/library/shows/watched.json';
	url += '/' + this.settings.traktApiKey;
	url += '/' + this.settings.traktUsername;

	request.get(url, {
		'auth': {
			'user': this.settings.traktUsername,
			'pass': this.settings.traktPassword,
		}
	}, this.createTransformer(callback, key));
};

trakt.getSeasons = function (callback, force, showId) {
	var url, cache, key;

	key = "getSeasons-" + showId;
	data = this.getCached(key, force);
	if (data) {
		return callback(null, data);
	}

	url = 'http://api.trakt.tv/show/seasons.json';
	url += '/' + this.settings.traktApiKey;
	url += '/' + showId;

	request.get(url, {}, this.createTransformer(callback, key));
};

trakt.markEpisodes = function (show, collection, state) {
	var collectionItem;

	collectionItem = _.find(collection, function(showInCollection) {
		return show.tvdb_id === showInCollection.tvdb_id;
	})

	if (collectionItem) {
		show[state] = true;
		// mark collected episodes
		collectionItem.seasons.forEach(function(collectedSeason) {
			collectedSeason.episodes.forEach(function(episode) {
				show.seasons[collectedSeason.season - 1].episodes[episode - 1] = state;
			});
		});

	} else {
		show[state] = false;
	}
};

trakt.getAllShowsExtended = function (callback, force) {
	async.parallel([
		_.bind(this.getAllShows, this),
		_.bind(this.getCollection, this),
		_.bind(this.getWatchedShows, this)
	], _.bind(function (err, results) {
		var state, shows, collection, watched;

		if (err) return callback(err);

		state = {
			processedShows:0
		};
		shows = results[0];
		collection = results[1];
		watched = results[2];
		shows.forEach(function(traktShow) {
			var fetchSeasonsAndBuildCollection;

			fetchSeasonsAndBuildCollection = _.bind(function (show, traktShow) {
				this.getSeasons(_.bind(function (err, seasons) {
					if (err) return callback(err);

					console.log("got seasons, save data", traktShow.title);
					show.traktSeasons = seasons;

					Show.update(show.id, {traktSeasons:seasons}, _.bind(function(err) {
						if (err) return callback(err);

						console.log("data saved, build collection for", traktShow.title);
						this.buildCollection(state, show, traktShow, shows, collection, watched, callback);
					}, this));
				}, this), force, traktShow.tvdb_id);
			}, this);

			console.log("search show in db for tvdb id", traktShow.title);
			Show.findByTvdbId(traktShow.tvdb_id, _.bind(function(err, show) {
				if (err) return callback(err);

				if (!show) {
					console.log("not found, create one for", traktShow.title);
					Show.create({
						collapsed:false,
						hidden:false,
						tvdbId:traktShow.tvdb_id
					}, function(err, show) {
						if (err) return callback(err);

						console.log("created, fetch seasons for", traktShow.title);
						fetchSeasonsAndBuildCollection(show, traktShow);
						return;
					});
					return;
				}

				console.log("local show found for", traktShow.title);
				if (!show.traktSeasons) {
					// fetch if show don't alredy contains season information or forced update
					console.log("but seasons not found for", traktShow.title);
					fetchSeasonsAndBuildCollection(show, traktShow);
					return;
				}

				console.log("local show has already season data for", traktShow.title);
				this.buildCollection(state, show, traktShow, shows, collection, watched, callback);
			}, this));


		}, this);
	}, this));
};

trakt.buildCollection = function (state, show, traktShow, shows, collection, watched, callback) {
	var collectionItem, seasons, nextSeason, nextSeasonToCheckIndex;

	seasons = show.traktSeasons;

	traktShow.seasons = [];

	// create seasons with empty episode lists
	seasons.forEach(function(season) {
		var newSeason, i;

		newSeason = {
			number:season.season,
			episodes:[]
		};

		for (i = 0; i < season.episodes; i++) {
			newSeason.episodes[i] = "none";
		}
		traktShow.seasons[season.season - 1] = newSeason;
	});

	// check if show is in collection
	this.markEpisodes(traktShow, collection, 'collected');

	// check if show is already watched
	this.markEpisodes(traktShow, watched, 'watched');

	// search for completely collected seasons, and add flags
	traktShow.completelyCollectedSeasons = _(traktShow.seasons)
		.first(function (season) {
			var complete;

			season.completelyCollected = true;
			season.completelyWatched = true;
			season.empty = true;
			season.episodes.forEach(function (episode) {
				if (episode === 'none') {
					season.completelyCollected = false;
				}
				if (episode !== 'watched') {
					season.completelyWatched = false;
				}

				if (episode !== 'none') {
					season.empty = false;
				}
			});

			return season.completelyCollected;
		})
		// create clones, so filter operations don't modify normal season objects
		.map(_.cloneDeep)
		.value();

	// save index before removing some shows
	nextSeasonToCheckIndex = traktShow.completelyCollectedSeasons.length;

	// remove watched seasons and filter episodes
	traktShow.completelyCollectedSeasons =
		_.filter(traktShow.completelyCollectedSeasons, function (season) {
			// keep only collected episodes
			season.episodes = _.filter(season.episodes, function (episode) {
				return episode === 'collected';
			});

			// remove completely watched seasons
			return !season.completelyWatched;
		});

	if (traktShow.seasons[nextSeasonToCheckIndex] &&
		traktShow.seasons[nextSeasonToCheckIndex].empty === false) {
		nextSeason = _.cloneDeep(traktShow.seasons[nextSeasonToCheckIndex]);

		// keep only first collected episodes
		nextSeason.episodes = _.first(nextSeason.episodes, function (episode) {
			return episode === 'collected';
		});

		traktShow.completelyCollectedSeasons.push(nextSeason);
	}

	// save complete count of collected episodes
	traktShow.completelyCollectedEpisodeCount = _.foldl(traktShow.completelyCollectedSeasons, function (sum, season) {
		return sum += season.episodes.length;
	}, 0);

	// save completely watched and collected
	traktShow.completelyWatched = _.every(traktShow.seasons, function (season) {
		return season.completelyWatched;
	});
	traktShow.completelyCollected = _.every(traktShow.seasons, function (season) {
		return season.completelyCollected;
	});
	traktShow.empty = _.every(traktShow.seasons, function (season) {
		return season.empty;
	});

	// finished?
	state.processedShows++;
	if (state.processedShows === shows.length) {
		callback(null, shows);
	}
};

module.exports = trakt;
