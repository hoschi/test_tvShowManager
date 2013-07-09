var trakt, TraktClient;

TraktClient = require('trakt');

trakt = {
	settings:{
		traktUsername:"",
		traktPassword:"",
		traktApiKey:""
	}
};

trakt.getOrCreateClient = function () {
	if (!this.client) {
		this.client = new TraktClient({
			'username':this.settings.traktUsername,
			'password':this.settings.traktPassword,
			'api_key':this.settings.traktApiKey
		});
		console.log("trakt client created with settings", this.settings);
	}
	return this.client;
};

trakt.getAllShows = function (callback) {
	var client;

	client = this.getOrCreateClient();
	return client.request('user', 'lastaciiitivity', {}, callback);
};

module.exports = trakt;
