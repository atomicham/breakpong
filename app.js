// modules
var express = require('express');
var app = express();
var http = require('http').Server(app);
var chat = require('./modules/chat.js')(http);
// server configuration
var port = process.env.port || 1337;

// define static route for static content directory.
app.use('/static', express.static('public_html/static'));

// define routes
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public_html/main.html');
});

http.listen(port, function () {
	console.log('HTTP server listening on *:' + port);
});