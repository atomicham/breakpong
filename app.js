// modules.
var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	chat = require('./modules/chat.js')(http),
	pongStorage = require('./modules/pong-storage.js')
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// configuration.
var port = process.env.port || 1337;
var host = process.env.hostaddr || '127.0.0.1';

// setup express.
app.use('/static', express.static('public_html/static'));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// passport setup.
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "http://" + host + ":" + port + "/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		return done(null, profile);
	});
}
));

// passport auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
	// Successful authentication, redirect home.
	res.redirect('/');
});

// define routes.
app.get('/', ensureLoggedIn('/login'), function (req, res) {
	res.sendFile(__dirname + '/public_html/main.html');
});

app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/public_html/login.html');
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// start server.
http.listen(port, function () {
	console.log('HTTP server listening on *:' + port);
});
