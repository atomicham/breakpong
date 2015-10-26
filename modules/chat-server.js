module.exports = function (io) {
	var chat = io.of('/chat');

	var userCount = 0;
	// Setup IO connection listener
	chat.on('connection', function (socket) {
		userCount++;

		console.log('a user connected, active users: ' + userCount);
		socket.broadcast.emit('serv usr conn', 'A user has connected.');

		socket.on('client msg', function (msg) {
			console.log('client msg sent: ' + msg.user + ": " + msg.text);
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