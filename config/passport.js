let ExtractJwt, JwtStrategy, LocalStrategy, User, tokenSecret;

JwtStrategy = require('passport-jwt').Strategy;

ExtractJwt = require('passport-jwt').ExtractJwt;

User = require('../app/models/user');

tokenSecret = require('./config').tokenSecret;

LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  let opts;
  opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = tokenSecret;
  opts.ignoreExpiration = true;
  passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    return User.forge({
      id: jwt_payload.id
    }).fetch({
      withRelated: ['role']
    }).then(function(user) {
      // if (!user.get('is_active')) {
      //   return done('User Disabled', false);
      // } else {
        console.log('Authentication success');
        console.log(user.get('email'));
        return done(null, user);
      // }
    })["catch"](function(err) {
      return done(err, false);
    });
  }));
  return passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    let criteria;
    if (!email || !password) {
      return done({
        err: 'Email and Password required'
      });
    }
    criteria = email.indexOf('@') === -1 ? {
      userName: email
    } : {
      email: email
    };
    return User.forge(criteria).fetch({
      withRelated: ['role']
    }).then(function(user) {
      if (!user) {
        return done(null, {
          err: 'Invalid Username/Email'
        });
      }
      return User.comparePassword(password, user, function(err, valid) {
        if (err) {
          return done(err);
        }
        if (!valid) {
          return done(null, {
            err: 'Invalid Password'
          });
        }
        if (valid) {
          return done(null, user);
        }
      });
    });
  }));
};

