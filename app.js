/***
 * Build-in | Third party module dependencies.
 */
var path = require('path'),
  http = require('http'),
  express = require('express'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser');

var app = express(),
  program = require('./package.json'),
  config = require('./config/server.env'),
  debug = require('debug')('logstack:server');

var env = process.env.NODE_ENV || 'development',
  staticEnvString = 'development';

/**
 * Application configurations for development environment.
 * NODE_ENV=development node server.js
 ***/
if (staticEnvString.toLowerCase() === env.toLowerCase()) {
  app.set('port', process.env.PORT || config.server.dev.port);
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, config.server.dev.codebase)));

  /**
   * Development error handlers, will print stacktrace.
   */
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/**
 * Application configurations for production environment.
 * NODE_ENV=production node server.js
 ***/
staticEnvString = 'production';
if (staticEnvString.toLowerCase() === env.toLowerCase()) {
  app.set('port', process.env.PORT || config.server.prod.port);
  app.use(logger('prod'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, config.server.prod.codebase)));

  /**
   * Production error handlers, no stacktrace leaked to user.
   */
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

/**
 * Catch 404 and forward to error handler.
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// var routes = require('./routes/index');
// var users = require('./routes/users');

// app.use('/', routes);
// app.use('/users', users);

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || config.server.dev.port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
console.log("\n\n\tlogstack server listening on %s", port);

server.on('error', onError);
server.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}