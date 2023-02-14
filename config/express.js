let ConnectRoles, busboy, compress, cors, express, favicon, glob, logger, methodOverride, passport;

express = require('express');

glob = require('glob');

favicon = require('serve-favicon');

logger = require('morgan');

compress = require('compression');

methodOverride = require('method-override');

passport = require('passport');

ConnectRoles = require('connect-roles');

busboy = require('express-busboy');

cors = require('cors');

let path = require('path');

module.exports = function(app, config) {
  let env, isAuthenticated, user;
  env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';
  user = new ConnectRoles({
    failureHandler: function(req, res, action) {
      let accept;
      accept = req.headers.accept || '';
      res.status(403);
      return res.json({
        message: 'Access Denied - You don\'t have permission to: ' + action
      });
    }
  });
  app.use(cors());
  app.use(logger('dev'));
  busboy.extend(app, {
    upload: true,
    path: 'public/uploads',
    allowedPath: /./,
    mimeTypeLimit: ['image/jpeg', 'image/png']
  });

  // app.use('/images',express.static(path.join( __dirname ,'../images' ) ) );

  app.use(compress());
  app.use(express["static"](config.root + '/public'));
  app.use(passport.initialize());
  app.use(user.middleware());
  app.use(methodOverride());
  require('./passport')(passport);
  
  isAuthenticated = passport.authenticate('jwt', {
    session: false
  });

  user.use('access admin', function(req) {
    return req.user.related('role').get('name') === 'Admin';
  });



  app.use('/auth', require('../routes/auth'));
  app.use('/roles', require('../routes/roles'));

  app.use('/users', isAuthenticated, require('../routes/users'));
 



  app.use(function(req, res, next) {
    return res.status(404).json({
      Error: "Not Found"
    });
  });
  if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
      res.status(err.status || 500);
      return res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }
  return app.use(function(err, req, res) {
    res.status(err.status || 500);
    return res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });
};
