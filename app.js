// modules.
var express = require('express'),
	jade = require('jade'),
	app = express(),
	profile = express(),
	http = require('http').Server(app),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	// passport
	passport = require('passport'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	GitHubStrategy = require('passport-github').Strategy,
	// socket io
	io = require('socket.io')(http),
	chat = require('./modules/chat.js')(io),
	// app storage
	pongStorage = require('./modules/pong-storage.js');
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
app.use(bodyParser.urlencoded({ extended: false }));
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

// passport auth strategies and routes
// google
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

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
	// Successful authentication, redirect home.
	res.redirect('/');
});

//github
passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: callbackHost + "/auth/github/callback"
},
  function (accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		return pongStorage.User.findOrCreate({ githubId: profile.id }, function (err, user) {
			return done(err, user);
		});
	});
}));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
	// Successful authentication, redirect home.
	res.redirect('/');
});



// app middlewares.
var checkIfRenameNeeded = function $checkIfRenameNeeded(req, res, next) {
	if (req.user.flagRename) {
		return res.redirect('/profileSetup');
	}
	next();
};

var checkIfAccountSetup = function $checkIfAccountSetup(req, res, next) {
	if (!req.user.flagRename && !req.user.flagSetup) {
		return res.redirect('/');
	}
	next();
};


// define routes.
app.get('/', [ensureLoggedIn('/login'), checkIfRenameNeeded], function (req, res) {
	res.render('main', { title: 'BreakPong', user: req.session.passport.user });
});

app.get('/profileSetup', [ensureLoggedIn('/login'), checkIfAccountSetup], function (req, res) {
	res.render('setup', { title: 'BreakPong Account Setup', userId: req.user.id, options: { flagRename: req.user.flagRename } });
});

app.get('/login', function (req, res) {
	res.render('login', { title: 'BreakPong Login' });
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// profile end points
profile.param('id', function (req, res, next, value) {
	if (!!value) {
		console.log('Found param ' + value)
		next();
	} else {
		res.sendStatus(404);
	}
});

profile.get('/details', ensureLoggedIn('/login'), function (req, res) {
	// return session id details.
});

//add endpoint to update username
profile.put('/update', ensureLoggedIn('/login'), function (req, res) {
	// get new user name
	if (req._body && !!req.body.name) {
		var user = req.user;
		
		user.name = req.body.name;
		if (!!req.body.email) {
			user.email = req.body.email;
		}
		user.flagRename = false;
		// get user from database
		pongStorage.User.merge(user, function (error, profile) {
			if (!error) {
				req.user = profile;
				res.sendStatus(200);
			}
		});
	} else {
		res.sendStatus(501);
	}
});

profile.get('/:id/details', ensureLoggedIn('/login'), function (req, res, next) {
	// get details about another user
	res.send('details');
	//next();
});

app.use('/profile', profile);

// initialize storage
pongStorage.initialize();

// start server.
http.listen(port, function () {
	console.log('HTTP server listening on *:' + port);
});
