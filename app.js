var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var responseController = require('./server/controllers/responseController');
var FACEBOOK_APP_ID = "1267163483311214";
var mongoose = require('mongoose');
var dbUrl = "mongodb://localhost:27017/responseProfile";
var FACEBOOK_APP_SECRET = "01f0836d634e38244d661d8feee83a48";

//var redis = require('redis');
var client = redis.createClient(10370, "redis://redistogo:8897206b2ab4b13b9425f52be3b729fb@viperfish.redistogo.com"); 
var client = redis.createClient();

//var client = redis.createClient(port, host);

client.on('connect', function() {
    console.log('connected');
});

mongoose.connect(dbUrl);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use('/bootstrap', express.static(__dirname+'/node_modules/bootstrap'));
app.use('/jquery', express.static(__dirname+'/node_modules/jquery'));
app.use('/images', express.static(__dirname+'/public/images/'));
app.use('/js', express.static(__dirname+'/client/js'));
app.use('/css', express.static(__dirname+'/client/css'));
app.use('/blueimp/js', express.static(__dirname+'/client/js/blueimp'));
app.use('/blueimp/css', express.static(__dirname+'/client/css/blueimp'));
app.use('/img', express.static(__dirname+'/public/images/blueimp'));

app.get('/', function(req, res) {
  if(req.isAuthenticated()){
    console.log("user object from app.get: %j", req.user);
    res.redirect('/profile');
  } else {
    res.render('index', { title: 'Nakul', user: req.user });
  }
});

app.post('/submit', function(req, res){
  var user = req.user._json.name;
  var response = JSON.stringify(req.body);
  console.log(response);
  console.log(req.user);
  res.send({response: "Your response was successfully recorded!"});
  client.hmset('responses', user, response);
});

app.get('/responses', ensureAuthenticated, function(req, res) {
    if(req.user._json.name === 'Deepak Nandihalli') {
      client.hgetall('responses', function(err, object) {
      console.log("from redis:");
      console.log(object.length);
      res.send(object);
      });
    } else {
      res.send({"response" : "You cannot access me!"})
    }
  });
// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res){
    res.redirect('/profile');
  });


app.get('/profile',ensureAuthenticated, responseController.fetch_response);

app.post('/profile', ensureAuthenticated, function(req,res){     
  responseController.createResponse(req,res);  
});

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next();}
  else {
    res.redirect("/");
  }
}

app.listen(process.env.PORT|3000);


module.exports = app;
