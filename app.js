var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Mongo stuff, needs to be before app.use?
//connect Mongoose to MongoDB
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/test');
var db = mongoose.connection; 
//error handler
db.on('error', console.error.bind(console, 'connection error:'));
//if connection successful, run
db.on('connected', function(){
	console.log('database connected!');
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/*//ajax stuff
$.ajax({
	url: '/',
	type: 'GET',
	data: {//TODO, ex. class: "web programming"},
	success: function(data){
		console.log('Data Loaded: ' + data);
	},
	error: function(xhr, status, error){
		console.log("Uh oh " + error);
	}
});*/

module.exports = app;
