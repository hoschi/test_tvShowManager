var trakt, request, _, async;

request = require('request');
_ = require('lodash');
async = require('async');

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
	if (err) {
		return callback(err);
	}

	json = JSON.parse(body);
	if (json.error) {
		return callback(json.error);
	}

	// save data in cache
	this.cache[key] = json;

	console.log("fetched data for key " + key);

	return callback(null, json);
};

trakt.getAllShows = function (force, callback) {
	var url, key, data;

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
 *        if (err) {
 *        return callback(err);
 *      }
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

trakt.getCollection = function (force, callback) {
	var url, key, data;

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

trakt.getWatchedShows = function (force, callback) {
	var url, data, key;

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
	var url, data, key;

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
	var collectionItem, sum;

	collectionItem = _.find(collection, function(showInCollection) {
		return show.tvdb_id === showInCollection.tvdb_id;
	});

	sum = 0;
	if (collectionItem) {
		show[state] = true;
		// mark collected episodes
		collectionItem.seasons.forEach(function(collectedSeason) {
			if (collectedSeason.season === 0) {
				// ignore special season
				return;
			}
			collectedSeason.episodes.forEach(function(episode) {
				var seasonToMark;

				seasonToMark = show.seasons[collectedSeason.season - 1];
				if (!seasonToMark) {
					console.log("uh oh, no season found!", collectedSeason.season - 1);
					return;
				}

				seasonToMark.episodes[episode - 1] = state;
				sum++;
			});
		});

	} else {
		show[state] = false;
	}
	show[state + "Count"] = sum;
};

trakt.fetchSeasonsAndBuildCollection = function (force, state, show, traktShow, shows, traktShows, collection, watched, callback) {
	this.getSeasons(_.bind(function (err, seasons) {
		if (err) {
			return callback(err);
		}

		console.log("got seasons, save data", traktShow.title, show.id);
		show.traktSeasons = seasons;

		Show.update({id:show.id}, {traktSeasons:seasons}, _.bind(function(err) {
			if (err) {
				return callback(err);
			}

			console.log("data saved, build collection for", traktShow.title);
			this.buildCollection(state, show, traktShow, shows, traktShows, collection, watched, callback);
		}, this));
	}, this), force, traktShow.tvdb_id);
};

trakt.updateOrCreateShow = function(force, forceSeasons, state, traktShow, shows, traktShows, collection, watched, callback) {
	console.log("search show in db for tvdb id", traktShow.title);
	Show.find({tvdbId:traktShow.tvdb_id}, _.bind(function(err, show) {
		if (err) {
			console.log("Error occured while searching for show '" + traktShow.title + "'");
			return callback(err);
		}

		if (!show) {
			console.log("not found, create one for", traktShow.title);
			Show.create({
				collapsed:false,
				hidden:false,
				tvdbId:traktShow.tvdb_id
			}, _.bind(function(err, show) {
				if (err) {
					return callback(err);
				}

				console.log("created, fetch seasons for", traktShow.title);
				this.fetchSeasonsAndBuildCollection(force, state, show, traktShow, shows, traktShows, collection, watched, callback);
				return;
			}, this));
			return;
		}

		console.log("local show found for", traktShow.title);

		if (show.hidden) {
			console.log("show is hidden, return", traktShow.title);
			state.processedShows++;
			if (state.processedShows === traktShows.length) {
				callback(null, shows);
			}
			return;
		}

		if (!show.traktSeasons || forceSeasons) {
			// fetch if show don't alredy contains season information or forced update
			console.log("but seasons not found for", traktShow.title);
			this.fetchSeasonsAndBuildCollection(force, state, show, traktShow, shows, traktShows, collection, watched, callback);
			return;
		}

		console.log("local show has already season data for", traktShow.title);
		this.buildCollection(state, show, traktShow, shows, traktShows, collection, watched, callback);
	}, this));
};

trakt.getUpdateOrCreateShowClosure = function (force, forceSeasons, state, traktShow, shows, traktShows, collection, watched, callback) {
	return _.bind(function () {
		this.updateOrCreateShow(force, forceSeasons, state, traktShow, shows, traktShows, collection, watched, callback);
	}, this);
};

trakt.getAllShowsExtended = function (callback, force, forceSeasons) {
	console.log("loading extended tv show data, forced?", force);

	async.parallel([
		_.bind(this.getAllShows, this, force),
		_.bind(this.getCollection, this, force),
		_.bind(this.getWatchedShows, this, force)
	], _.bind(function (err, results) {
		var state, shows, traktShows, collection, watched, i;

		if (err) {
			return callback(err);
		}

		state = {
			processedShows:0
		};
		shows = [];
		traktShows = results[0];
		collection = results[1];
		watched = results[2];

		for (i = 0; i < traktShows.length; i++) {
			// delay because 200 concurrent find requests to mongo break the app (sails.js adapter!!!?)
			_.delay(this.getUpdateOrCreateShowClosure(force, forceSeasons, state, traktShows[i], shows, traktShows, collection, watched, callback),
				i * 10);
		}
	}, this));
};

trakt.buildCollection = function (state, show, traktShow, shows, traktShows, collection, watched, callback) {
	var seasons, nextSeason, nextSeasonToCheckIndex, sum;

	seasons = show.traktSeasons;

	traktShow.seasons = [];

	// create seasons with empty episode lists
	sum = 0;
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
		if (season.season !== 0) {
			sum += season.episodes;
		}
	});
	traktShow.episodeCount = sum;

	// check if show is in collection
	this.markEpisodes(traktShow, collection, 'collected');

	// check if show is already watched
	this.markEpisodes(traktShow, watched, 'watched');

	// search for completely collected seasons, and add flags
	traktShow.completelyCollectedSeasons = _(traktShow.seasons)
		.first(function (season) {
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

	// save 'copmleted' ratio
	traktShow.watchedPercent = Math.round((100 / traktShow.episodeCount) * traktShow.watchedCount);
	traktShow.collectedPercent = Math.round((100 / traktShow.episodeCount) * traktShow.collectedCount);
	traktShow.continuouslyCollectedPercent = Math.round((100 / (traktShow.episodeCount - traktShow.watchedCount)) * traktShow.completelyCollectedEpisodeCount);

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

	show.traktData = traktShow;

	Show.update({id:show.id}, {traktData:traktShow}, _.bind(function(err) {
		if (err) {
			return callback(err);
		}

		console.log("data saved ", traktShow.title);
		shows.push(show);

		// finished?
		state.processedShows++;
		if (state.processedShows === traktShows.length) {
			callback(null, shows);
		}
	}, this));
};

module.exports = trakt;
