/*---------------------
	:: Show
	-> model
---------------------*/
module.exports = {

	attributes:{
        /*
		 *title:'STRING',
         *tvdb_id:'STRING',
         */
        collapsed:'BOOLEAN',
        hidden:'BOOLEAN',
        tvdbId:'STRING',
        traktSeasons:'JSON',
        traktData:'JSON'

		// Simple attribute:
        //name: 'STRING',

		// Or for more flexibility:
		// phoneNumber: {
		//	type: 'STRING',
		//	defaultsTo: '555-555-5555'
		// }

	}

};
