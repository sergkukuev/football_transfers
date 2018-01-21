var express         = require('express'),
    glob            = require('glob'),
    favicon         = require('serve-favicon'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    compress        = require('compression'),
    methodOverride  = require('method-override'),
    cors            = require('cors');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var routes = glob.sync(config.root + '/app/routes/*.js');
  routes.forEach(function (route) {
    require(route)(app);
  });

// 404
  app.use(function (req, res, next) {
    var err = new Error('Route not found');
    err.status = 404;
    next(err);
  });
  
  // 500
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
      	status : "Error",
        message: err.message
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      	status: "Error",
        message: err.message
      });
  });

  return app;
};