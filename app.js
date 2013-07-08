var trakt, argv;

argv = require('optimist').argv;
trakt = require('api/services/trakt');

// set stuff from command line
trakt.userName = argv.userName;
trakt.password = argv.password;

// Start sails and pass it command line arguments
require('sails').lift(argv);
