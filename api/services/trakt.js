var trakt, request;

request = require('request');

trakt = {
	settings:{
		traktUsername:"",
		traktPassword:"",
		traktApiKey:""
	}
};

trakt.getAllShows = function (callback) {
	var url;

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
		callback(null, json);
	});
};

module.exports = trakt;
