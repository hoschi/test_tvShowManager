/*---------------------
	:: Settings
	-> controller
---------------------*/
var getFirst = function (req, res) {
	Settings.find(1).done(function(err, settings){
		if (err) {
			console.error("error");
			res.send(500);
		}
		if (!settings) {
			console.error("error");
			res.send(404, "Settings object should be there but isn't, this should be created during bootstrap!");

		}

		console.log(settings);
		res.json(settings.values);
	});
};

var SettingsController = {
	index:function (req, res) {
		console.log("called settings, index");
		getFirst(req, res);
	},

	find:function (req, res) {
		console.log("called settings, find");
		getFirst(req, res);
	},

	all:function (req, res) {
		console.log("called settings, all");
		Settings.findAll().done(function(err, settingsList){
			if (err) {
				console.error("error");
				res.send(500);
			}
			res.json(settingsList);
		});
	}

};
module.exports = SettingsController;
