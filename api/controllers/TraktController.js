/*---------------------
	:: Trakt
	-> controller
---------------------*/
var trakt = require('../services/trakt');
var TraktController = {

	// To trigger this action locally, visit: `http://localhost:port/trakt/collection`
	collection: function (req,res) {
		res.json([trakt.test]);

	}

};
module.exports = TraktController;