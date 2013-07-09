// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
module.exports.bootstrap = function (cb) {

	AwesomeThing.findAll().done(function(err, things) {
		if (err) return cb(err);
		Settings.findAll().done(function (err, settingsList) {
			if (err) return cb(err);
			// ATTENTION doesn't work
			if (!things && things.length > 0 &&
				settingsList && settingsList.length > 0) {
				return cb();
			}

			AwesomeThing.create({
				name: 'AngularJS'
			},function() {
				AwesomeThing.create({
					name: 'HTML5 Boilerplate'
				}, function() {
					AwesomeThing.create({
						name: 'Karma'
					}, function() {
						AwesomeThing.create({
							name: 'SailsJS'
						}, function() {
							AwesomeThing.create({
								name: 'Bootstrap'
							}, function () {
								Settings.create({
									traktUsername:"",
									traktPassword:""
								}, cb);
							});
						});
					});
				});
			});
		});
	});


};
