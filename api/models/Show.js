/*---------------------
	:: Show
	-> model
---------------------*/
module.exports = {

	attributes:{
        collapsed:'BOOLEAN',
        hidden:'BOOLEAN',
        tvdbId:'STRING',
        traktSeasons:'JSON'

		// Simple attribute:
        //name: 'STRING',

		// Or for more flexibility:
		// phoneNumber: {
		//	type: 'STRING',
		//	defaultsTo: '555-555-5555'
		// }

	}

};
