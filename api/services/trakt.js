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
	//}, this.createTransformer(callback, key));
	// this is only for development purposes
	}, this.createTransformer(_.bind(function (err, data) {
		if (err) return callback(err);

		newData = data.filter(function (show) {
			return show.title === "7 Days" ||
					show.title === "Alphas" ||
					show.title === "The A-Team" ||
					show.title === "The West Wing";
		});
		this.cache[key] = newData;
		callback(null, newData);
	}, this), key));
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
		var processedShows, shows, collection, watched;

		if (err) return callback(err);

		processedShows = 0;
		shows = results[0];
		collection = results[1];
		watched = results[2];
		shows.forEach(function(show) {
			var collectionItem, seasons;

			this.getSeasons(_.bind(function (err, seasons) {
				if (err) return callback(err);

				show.seasons = [];

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
					show.seasons[season.season - 1] = newSeason;
				});

				// check if show is in collection
				this.markEpisodes(show, collection, 'collected');

				// check if show is already watched
				this.markEpisodes(show, watched, 'watched');

				// search for completely collected seasons
				show.completelyCollectedSeasons = _(show.seasons)
					.first(function (season) {
						var complete;

						complete = _.every(season.episodes, function (episode) {
							return episode !== 'none';
						});

						season.completelyCollected = complete;
						return complete;
					})
					.filter(function (season) {
						var completeWatched;

						complete = _.every(season.episodes, function (episode) {
							return episode !== 'none';
						});

						season.completelyCollected = complete;
						return complete;
					})
					.value();

				// finished?
				processedShows++;
				if (processedShows === shows.length) {
					callback(null, shows);
				}
			}, this), force, show.tvdb_id);

		}, this);
	}, this));
};

module.exports = trakt;
