module.exports = (function () {
	// require modules
	var azure = require('azure-storage');
	var uuid = require('node-uuid');
	var entityGen = azure.TableUtilities.entityGenerator;
	
	// static variables
	// users
	var usersTable = "users";
	var usersPartitionKey = "RegisteredUsers";
	var anonymousName = "Anonymous";
	// games
	var gamesTable = "games";
	var gamesPartitionKey = "Games";
	
	// module ref.
	var m = {};
	
	var User = function () {
		this.name = null;
	};
	
	User.MapFromEntity = function $User$MapFromEntity(entity) {
		var user = new User();
		user.id = entity.RowKey._;
		user.name = entity.Name._;
		user.flagRename = entity.FlagRename._;
		return user;
	};
	
	User.MapToEntity = function $User$MapToEntity(user) {
		var entity = {
			PartitionKey: entityGen.String(usersPartitionKey),
			RowKey: entityGen.String(user.id),
			Name: entityGen.String(user.name),
			FlagRename: entityGen.Boolean(user.flagRename)
		};
		return entity;
	};
	
	var Game = function () {
		this.id = null;
	};
	
	Game.MapFromEntity = function $Game$MapFromEntity(entity) {
		var game = new Game();
		return game;
	};
	
	Game.MapToEntity = function $Game$MapToEntity(game) {
		var entity = {

		};
		return entity;
	};
	
	// members
	var tableSvc = null;
	
	// initialize method
	m.initialize = function $init() {
		// use seperate table for development
		// create the user table
		tableSvc = azure.createTableService();
		tableSvc.createTableIfNotExists(usersTable, function (error, result, response) {
			if (!error) {
				console.log('Users table found.');
			}
		});
		
		tableSvc.createTableIfNotExists(gamesTable, function (error, result, response) {
			if (!error) {
				console.log('Games table found.');
			}
		});
	};
	
	// get user
	// add user
	// update user
	m.User = {
		find: function $User$find(profile, callback) {
			var query = new azure.TableQuery();
			
			if (!!profile.id) {
				query.where('RowKey eq ?', profile.id);
			} else if (!!profile.googleId) {
				query.where('GoogleID eq ?', profile.googleId);
			} else if (!!profile.githubId) {
				query.where('GitHubID eq ?', profile.githubId);
			}
			
			var err = null;
			
			tableSvc.queryEntities(usersTable, query, null, function (error, result, response) {
				if (!error) {
					// result contains the entities
					// get user from db
					if (result.entries.length > 0) {
						// return existing user
						profile = User.MapFromEntity(result.entries[0]);
						
						callback(err, profile);
					} else {
						// perform callback ?
						//callback();
					}
				} else {
					callback(error, profile);
				}
			});
		},
		//findOrCreate		
		findOrCreate: function $User$findOrCreate(profile, callback) {
			var query = new azure.TableQuery();
			
			if (!!profile.id) {
				query.where('RowKey eq ?', profile.id);
			} else if (!!profile.googleId) {
				query.where('GoogleID eq ?', profile.googleId);
			} else if (!!profile.githubId) {
				query.where('GitHubID eq ?', profile.githubId);
			}
			
			var err = null;
			
			tableSvc.queryEntities(usersTable, query, null, function (error, result, response) {
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
							PartitionKey: entityGen.String(usersPartitionKey),
							RowKey: entityGen.String(uuid.v4()),
							Name: entityGen.String(anonymousName),
							FlagRename: entityGen.Boolean(true)
						};
						
						if (!!profile.googleId) {
							user.GoogleID = entityGen.String(profile.googleId);
						} else if (!!profile.githubId) {
							user.GitHubID = entityGen.String(profile.githubId);
						}
						
						tableSvc.insertEntity(usersTable, user, { echoContent: true }, function (error, result, response) {
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
		},
		update: function $User$update(user, callback) {
			var entity = User.MapToEntity(user);
			tableSvc.updateEntity(usersTable, entity, function (error, result, response) {
				if (!error) {
					var user = User.MapFromEntity(result);
					callback(error, user);
				} else {
					callback(error);
				}
			});
		},
		merge: function $User$merge(user, callback) {
			var entity = User.MapToEntity(user);
			tableSvc.mergeEntity(usersTable, entity, function (error, result, response) {
				if (!error) {
					callback(error, user);
				} else {
					callback(error);
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