module.exports = (function () {
	// require modules
	var azure = require('azure-storage');

	// module ref.
	var m = {};
	
	// initialize method
	m.initialize = function $init() {
		var entityGen = azure.TableUtilities.entityGenerator;
		
		// use seperate table for development
		// create the user table
		var tableSvc = azure.createTableService();
		tableSvc.createTableIfNotExists('users', function (error, result, response) {
			if (!error) {
				console.log('Users table exists.')
			}
		});
		
		tableSvc.createTableIfNotExists('games', function (error, result, response) {
			if (!error) {
				console.log('Games table exists.')
			}
		});
	};

	// get user
	// add user
	// update user
	m.User = {
		//findOrCreate		
		findOrCreate: function $User$findOrCreate(profile, callback) {
			debugger;
			// get user from db
			var u = profile;
			var e = null;
			// if error, 
			callback(e, u);
		}
	};
	
	// get game
	// add game
	// update game
	m.Game = {
		findOrCreate: function (filter, callback) {

		}
	};


	// return complete module
	return m;
}());