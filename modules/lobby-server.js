module.exports = function (io) {
	var lobby = io.of('/lobby');
	
	// Setup IO connection listener
	lobby.on('connection', function (socket) {
		var id = 0;
		
		socket.emit('new game', {
			id: 0,
			info: {
				type: 'pong', 
				maxPlayers: 2
			}, 
			players: ['nazhrenn']
		});
			
		setInterval(function () {
			(function (id) {
				socket.emit('new game', {
					id: id ,
					info: {
						type: 'pong', 
						maxPlayers: 2
					}, 
					players: []
				});
				
				setTimeout(function () {
					
					socket.emit('update game', {
						id: id,
						info: {
							type: 'pong', 
							maxPlayers: 2
						}, 
						players: ['nazhrenn', 'user1']
					});
					
					setTimeout(function () {
						socket.emit('remove game', id);
					}, 30000);
				}, 500);
			}(++id));
		}, 1000);
		
		// Specify socket listeners
		socket.on('disconnect', function () {
		});
	});
};