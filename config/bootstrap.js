// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
module.exports.bootstrap = function (cb) {

/*
 *    console.log("running bootstrap");
 *    Settings.find().done(function (err, settings) {
 *        if (err) return cb(err);
 *
 *        // ATTENTION doesn't work
 *        if (settings) {
 *            console.log("found settings", settings);
 *            return cb();
 *        }
 *
 *        console.log("settings not found, creating");
 *        Settings.create({
 *            traktUsername:"",
 *            traktPassword:"",
 *            traktApiKey:""
 *        }, function (err, foo) {
 *            if (err) return callback(err);
 *
 *            cb("restart please!");
 *        });
 *    });
 */
	cb();


};
