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
		console.error("No settings found");

	}

	console.log("setup trakt service, done");
	trakt.settings = settings.values;
});

var TraktController = {

	// To trigger this action locally, visit: `http://localhost:port/trakt/collection`
	collection: function (req,res) {
		trakt.getCollection(function (err, shows) {
			if (err) {
				return res.send(err, 500);
			}
			res.json(shows);
		});
	}

};
module.exports = TraktController;
