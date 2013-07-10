/*---------------------
	:: Settings
	-> model
---------------------*/
module.exports = {

	attributes: {

		// Simple attribute:
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
		Settings.find(1).done(function(err, settings){
			if (err) return callback(err);

			if (!settings) {
				callback();
			}

			//console.log(settings);
			callback(null, settings);
		});
	}

};
