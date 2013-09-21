/*---------------------
	:: Settings
	-> controller
---------------------*/
var getFirst;

getFirst = function (req, res) {
	Settings.getFirst(function(err, settings){
		if (err) {
			res.send(500, err);
			return;
		}

		if (!settings) {
			res.send(404);
			return;
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
	},

	create:function (req, res) {
		res.send(500, "This is not allowed, you can't have more than one settings object");
	},

	destroy:function (req, res) {
		res.send(500, "Why you wanna do that?!");
	},

	update:function (req, res) {
		Settings.update(req.param('id'), req.body, function(err) {
			console.log("updated trakt service settings");
			trakt.settings = req.body;
			res.send(req.body);
		});
	}

};
module.exports = SettingsController;
