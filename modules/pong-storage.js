
var azure = require('azure-storage');

// use seperate table for development
// create the user table
var tableSvc = azure.createTableService();
tableSvc.createTableIfNotExists('users', function (error, result, response) {
	if (!error) {

	}
});

tableSvc.createTableIfNotExists('games', function (error, result, response) {
	if (!error) {

	}
});

// get user

// add user

// update user

// get game

// add game

// update game