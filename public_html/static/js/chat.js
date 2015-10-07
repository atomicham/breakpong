(function () {
	var socket = io();
	
	var text = $("#chatText");
	var send = $("#chatSend");
	var messages = $("#chatMessages");

	function addMessage(msg) {
		var message = $('<li>').text(msg);
		messages.append(message);
	}

	send.click(function () {
		socket.emit('client msg', text.val());
		text.val('');
		return false;
	});

	socket.on('serv msg', function (msg) {
		addMessage(msg);
	});

	socket.on('serv usr conn', function (msg) {
		addMessage(msg);
	});

	socket.on('serv usr disc', function (msg) {
		addMessage(msg);
	});
}());