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
	chat = require('./modules/chat-server.js'),
	lobby = require('./modules/lobby-server.js'),
	// app storage
	pongStorage = require('./modules/pong-storage.js');

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
	res.render('main', { title: 'BreakPong' });
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
	res.send({
		id: req.user.id, 
		name: req.user.name
	});
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

profile.get('/:id/avatar', function (req, res) {
	if (req.params.id === 'nazhrenn') {
		res.redirect('https://avatars1.githubusercontent.com/u/770217?v=3&s=140');
	} else {
		switch (req.params.id) {
			case 'user1':
				var data = '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';
				var img = new Buffer(data, 'base64');
				res.writeHead(200, {
					'Content-Type': 'image/jpeg',
					'Content-Length': img.length
				});
				res.end(img); 
				break;
			default:
				res.sendStatus(404);
				
				break;
		}
	}
});



app.use('/profile', profile);

// initialize storage
pongStorage.initialize();

// initialize chat server.
chat(io);

// initialize lobby server
lobby(io);

// start server.
http.listen(port, function () {
	console.log('HTTP server listening on *:' + port);
});
