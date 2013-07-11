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
	}, this.createTransformer(function (err, data) {
		if (err) return callback(err);

		newData = data.filter(function (show) {
			return show.title === "7 Days" ||
					show.title === "Alphas" ||
					show.title === "The West Wing";
		});
		callback(null, newData);
	}, key));
};

trakt.getCollection = function (callback, force) {
	var url, cache, key;

	key = "getCollection";
	data = this.getCached(key, force);
	if (data) {
		return callback(null, data);
	}

	cache = this.cache;

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

trakt.getAllShowsExtended = function (callback, force) {
	return this.getAllShows(_.bind(function (err, shows) {
		this.getCollection(_.bind(function (err, collection) {
			// TODO this is not parallel, use async lib
			callback(null, shows);
		}, this), force);
	}, this), force);
};

module.exports = trakt;
