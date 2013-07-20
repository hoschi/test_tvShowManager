// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
module.exports.bootstrap = function (cb) {

	console.log("running bootstrap");
	Settings.findAll().done(function (err, settingsList) {
		if (err) return cb(err);

		// ATTENTION doesn't work
		if (settingsList && settingsList.length > 0) {
			console.log("found settings");
			return cb();
		}

		console.log("settings not found, creating");
		Settings.create({
			traktUsername:"",
			traktPassword:"",
			traktApiKey:""
		}, function (err) {
			if (err) return callback(err);

			cb("restart please!");
		});
	});
	//cb();


};
