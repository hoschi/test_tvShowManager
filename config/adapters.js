// Configure installed adapters
// If you define an attribute in your model definition,
// it will override anything from this global config.
module.exports.adapters = {

	// If you leave the adapter config unspecified
	// in a model definition, 'default' will be used.
	'default': 'mongo',

	mongo: {
		module : 'sails-mongo-hoschi',
		url	: 'mongodb://localhost/tvshm'
	}
};
