/*---------------------
	:: Trakt
	-> controller
---------------------*/
var trakt = require('../services/trakt');

// setup trakt module
Settings.getFirst(function(err, settings){
	if (err) {
		console.error(err);
	}
	if (!settings) {
		console.error("No settings found, look into bootstrap.js!!!!");
		return;
	}

	console.log("setup trakt service, done");
	trakt.settings = settings.values;
});

var TraktController = {

	// To trigger this action locally, visit: `http://localhost:port/trakt/collection`
	collection: function (req, res) {
		var force, forceSeasons;

		force = req.param('force');
		forceSeasons = req.param('forceSeasons');

		if (force || forceSeasons) {
			console.log('forced, fetching data from trakt');
			trakt.getAllShowsExtended(function (err, shows) {
				if (err) {
					throw new Error(err);
					return res.send(err, 500);
				}
				res.json(shows);
			}, force, forceSeasons);
			return;
		}

		console.log('not forced, get data from DB');
		Show.findAll().done(function(err, shows){
			if (err) {
				console.error("error");
				res.send(500);
			}
			res.json(shows);
		});
	},

};
module.exports = TraktController;
