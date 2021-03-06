﻿module.exports = function (http) {
	var io = require('socket.io')(http);

	var userCount = 0;

	// Setup IO connection listener
	io.on('connection', function (socket) {
		userCount++;

		console.log('a user connected, active users: ' + userCount);
		socket.broadcast.emit('serv usr conn', 'A user has connected.');

		socket.on('client msg', function (msg) {
			console.log('client msg sent: ' + msg);
			socket.emit('serv msg', msg);
		});
		
		// Specify socket listeners
		socket.on('disconnect', function () {
			userCount--;
			console.log('user disconnected, active users: ' + userCount);
			socket.broadcast.emit('serv usr disc', 'A user has disconnected.');
		});
	});
};