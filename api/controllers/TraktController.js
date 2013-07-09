/*---------------------
	:: Trakt
	-> controller
---------------------*/
var trakt = require('../services/trakt');

// setup trakt module
// TODO refactore this and getFirst of SettingsController into model?!
Settings.find(1).done(function(err, settings){
	if (err) {
		console.error(err);
	}
	if (!settings) {
		console.error("No settings found");

	}

	console.log("setup trakt service");
	trakt.settings = settings.values;
});

var TraktController = {

	// To trigger this action locally, visit: `http://localhost:port/trakt/collection`
	collection: function (req,res) {
		trakt.getAllShows(function (err, shows) {
			if (err) {
				return res.send(err, 500);
			}
			res.json(shows);
		});
	}

};
module.exports = TraktController;
