module.exports = (function () {
	// require modules
	var azure = require('azure-storage');
	var entityGen = azure.TableUtilities.entityGenerator;
	
	// module ref.
	var m = {};
	
	var User = function () {
		this.name = null;
	};
	
	User.MapFromEntity = function $User$MapFromEntity(entity) {
		var user = new User();
		user.name = entity.RowKey._;
		
		return user;
	};
	
	User.MapToEntity = function $User$MapToEntity(user) {
		var entity = {
			PartitionKey: entityGen.String('registered'),
			RowKey: entityGen.String(user.name)
		};
		return entity;
	};
	
	var Game = function () {
		this.id = "0000000";
	};
	
	// members
	var tableSvc = null;
	
	// initialize method
	m.initialize = function $init() {
		
		// use seperate table for development
		// create the user table
		tableSvc = azure.createTableService();
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
			var query = new azure.TableQuery();
			
			if (!!profile.googleId) {
				query.where('GoogleID eq ?', profile.googleId);
			} else if (!!profile.githubId) {
				query.where('GitHubID eq ?', profile.githubId);
			}
			
			var err = null;
			
			tableSvc.queryEntities('users', query, null, function (error, result, response) {
				if (!error) {
					// result contains the entities
					// get user from db
					if (result.entries.length > 0) {
						// return existing user
						profile = User.MapFromEntity(result.entries[0]);
						
						callback(err, profile);
					} else {
						// create user (?)
						var user = {
							PartitionKey: entityGen.String('registered'),
							RowKey: entityGen.String('Anonymous')
						};
						
						if (!!profile.googleId) {
							user.GoogleID = entityGen.String(profile.googleId);
						}
						
						tableSvc.insertEntity('users', user, { echoContent: true }, function (error, result, response) {
							if (!error) {
								var user = User.MapFromEntity(result);
								callback(err, user);
							} else {
								callback(error, profile);
							}
						});
					}
					
					
					// if error, 
				} else {
					callback(error, profile);
				}
			});
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