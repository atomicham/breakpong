
var azure = require('azure-storage');
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

// get user

// add user

// update user

// get game

// add game

// update game