(function () {
	var socket = io('http://localhost:1337/chat');
	
	var text = $("#chatText");
	var send = $("#chatSend");
	var messages = $("#chatMessages");

	function addMessage(msg) {
		var message = $('<li>').text(msg);
		messages.append(message);
	}

	send.click(function () {
		var value = text.val();
		if (!!value && !!value.trim()) {
			socket.emit('client msg', value);
			text.val('');
		}
		return false;
	});

	text.keyup(function (e) {
		if (e.keyCode == 13) {
			send.click();
		}
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