var trakt, request;

request = require('request');

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

trakt.getCollection = function (callback, force) {
	var url, cache;

	data = this.getCached("getCollection", force);
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
	}, function (err, resp, body) {
		var json;
		if (err) return callback(err);

		json = JSON.parse(body);
		if (json.error) {
			return callback(json.error);
		}

		// save data in cache
		cache["getCollection"] = json;

		return callback(null, json);
	});
};

module.exports = trakt;
