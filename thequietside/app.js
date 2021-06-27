var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressHbs = require('express-handlebars');//for the use of new handlebars templating engine third-party package that has more features than the build in one.
var mongoose = require('mongoose');//import mongoose

var session= require('express-session');

var passport = require('passport');//used for user management, authentication, login, signup, and etc.
var flash = require('connect-flash');//popup messages for user management
var validator = require('express-validator'); //used to validate email for signup
var MongoStore = require('connect-mongo')(session);//import MongoStore in order to configure session

//To avoid "Handlebars: Access has been denied to resolve the properties "imagePath" "title" "description" and "price" because it is not an "own property" of its parent" error
//HANDLEBARS ERROR FIX/////////////////////////////////////////////////////////////////////
var Handlebars = require('handlebars');
const{allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
///////////////////////////////////////////////////////////////////////////////////////////

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();

mongoose.connect('mongodb://localhost:27017/thequietsideshop');
require('./config/passport');//in order for password to recognize authentication strategy
// view engine setup
app.engine('.hbs' , expressHbs({defaultLayout: 'layout' , extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));//replaced app.set with app.engine in order to use the new package
app.set('view engine', '.hbs');//replaced hbs with .hbs to refer to the new engine

app.use(express.static('images/'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'myodesecret', 
  resave: false,/*session will not be saved on server after each request*/
  saveUninitialized: false, /*session will not be stored on the server even if not initialized*/
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000}/*how long session should live before it expires. In this case, 180 mins*/
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());//stores users
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session; //make session available in views so handlebars can directly access session.
  next();
});

app.use('/user', usersRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
