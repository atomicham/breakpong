// modules.
var express = require('express'),
	jade = require('jade'),
	app = express(),
	http = require('http').Server(app),
	cookieParser = require('cookie-parser'),
//	bodyParser = require('body-parser'),
	session = require('express-session'),
	passport = require('passport'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	chat = require('./modules/chat.js')(http),
	pongStorage = require('./modules/pong-storage.js'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//TODO add handlebars template engine to pass session data to client.

// configuration.
var port = process.env.port || 1337;
var host = process.env.hostaddr || '127.0.0.1';
var sessionSecret = process.env.SESSION_SECRET || 'keyboard cat';

// setup express.
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/static', express.static('static'));
app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// passport setup.
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

var callbackHost;
if ('development' == app.get('env')) {
	callbackHost = "http://" + host + ":" + port;
} else {
	callbackHost = "http://" + host;
}

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: callbackHost + "/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		return pongStorage.User.findOrCreate({ googleId: profile.id }, function (err, user) {
			return done(err, user);
		});
	});
}));

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
	res.render('main');
});

app.get('/login', function (req, res) {
	res.render('login');
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// initialize storage
pongStorage.initialize();

// start server.
http.listen(port, function () {
	console.log('HTTP server listening on *:' + port);
});
