/*---------------------
	:: Settings
	-> model
---------------------*/
module.exports = {

	attributes: {

		traktUsername: 'STRING',
		traktPassword: 'STRING',
		traktApiKey: 'STRING'

		// Or for more flexibility:
		// phoneNumber: {
		//	type: 'STRING',
		//	defaultsTo: '555-555-5555'
		// }

	},

	getFirst: function (callback) {
		Settings.find().done(function(err, settings){
			if (err) return callback(err);

			if (!settings) {
				Settings.create({
					traktUsername:"",
					traktPassword:"",
					traktApiKey:""
				}, function (err, newSettings) {
					if (err) return callback(err);

					console.log("Settings created: ", newSettings);
					return callback(null, newSettings);
				});
			}

			//console.log("settings found: ", settings);
			callback(null, settings);
		});
	}

};
