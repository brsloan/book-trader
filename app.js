var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
require('./server/components/user/UsersModel');
require('./server/components/book/BookModel');
require('./server/components/trade/TradeModel');
var dotenv = require('dotenv');
dotenv.load();

require('./server/config/passport');

mongoose.connect(process.env.MONGO_URI);

var indexRoutes = require('./server/components/index/indexRoutes.server.js');
var userRoutes = require('./server/components/user/userRoutes.server.js');
var bookRoutes = require('./server/components/book/bookRoutes.server.js');
var tradeRoutes = require('./server/components/trade/tradeRoutes.server.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/server/components/index'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'client', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

app.use('/', indexRoutes);
app.use('/', userRoutes);
app.use('/', bookRoutes);
app.use('/', tradeRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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

app.use(passport.initialize());

module.exports = app;
