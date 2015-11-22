var express = require('express');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');

var router = express.Router();
router.get('/:gameid', function(req, res, next) {
  res.sendFile('index.html', {root: './public'});
});
router.get('/:gameid/state/latest', function(req, res, next) {
  var gameid = req.params.gameid;
  var pattern = util.format("gamestate_%s_*.json", gameid);
  var fullPattern = path.join(app.settings.dumps, pattern);
  glob(fullPattern, function(err, paths) {
    res.sendFile(paths.pop().split('/').slice(-1)[0], {root: app.settings.dumps});
  });
});
router.get('/:gameid/state/:tick', function(req, res, next) {
  var gameid = req.params.gameid;
  var tick = req.params.tick;
  var pattern = util.format("gamestate_%s_*_*%d.json", gameid, tick);
  var fullPattern = path.join(app.settings.dumps, pattern);
  glob(fullPattern, function(err, paths) {
    res.sendFile(paths[0].split('/').slice(-1)[0], {root: app.settings.dumps});
  });
});
router.get('/:gameid/intel', function(req, res, next) {
  var gameid = req.params.gameid;
  var filename = util.format('intel_%s.json', gameid);
  res.sendFile(filename, {root: app.settings.dumps});
});

var app = express();
app.use('/', router);
app.set('dumps', 'C:\\Users\\Emil\\Desktop\\NP2Dumper\\dumps');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(path.join(__dirname, 'public')));

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


module.exports = app;
