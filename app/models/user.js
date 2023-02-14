let Bookshelf, InviteDetail, Promise, User, bcrypt, userValidationSchema, socialUserValidationSchema;

Bookshelf = require('./index');
Promise = require('bluebird');
bcrypt = require('bcrypt');
// bcrypt = require('bcrypt-nodejs');

userValidationSchema = require('./model_validations').userValidationSchema;
socialUserValidationSchema = require('./model_validations').socialUserValidationSchema;

// require('./role');

User = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  hidden: ['encrypted_password'],
  initialize: function() {
    this.on('creating', this.validateEverything);
    this.on('creating', this.hashPassword);
    this.on('saving', this.validateExistingUsername);
    this.on('saving', this.validateExistingEmail);
    // this.on('saving', this.validateExistingMobile);
    return this.on('updating', this.updatePassword);
  },
  role: function() {
    return this.belongsTo('Role');
  },
 
  fcm_tokens: function() {
    return this.hasMany('FcmToken');
  },

  cars: function() {
    return this.hasMany('Car');
  },

  
  validateEverything: function(model, attrs, options) {
    if(model.has('providerId')){
      return new Promise(function(resolve, reject) {
        return socialUserValidationSchema.validate(model.attributes, function(err, value) {
          if (err) {
            return reject(err);
          } else {
            return resolve(value);
          }
        });
      });
    }else{
      return new Promise(function(resolve, reject) {
        return userValidationSchema.validate(model.attributes, function(err, value) {
          if (err) {
            return reject(err);
          } else {
            return resolve(value);
          }
        });
      });
    }
  },
  validateExistingEmail: function(model, attr, options) {
    if (!model.has('providerId') && this.hasChanged('email')) {
      return User.query('where', 'email', this.get('email')).fetch().then(function(existing) {
        if (existing) {
          throw new Error('Email already exists');
        }
      });
    }else if(model.has('providerId')){
      return User.query({where: {email: this.get('email'), providerName: this.get('providerName')} }).fetch().then(function(existing) {
        if (existing) {
          throw new Error('Email already exists');
        }
      });
    }
  },
  validateExistingUsername: function(model, attr, options) {
    if (this.hasChanged('userName')) {
      return User.query('where', 'userName', this.get('userName')).fetch().then(function(existing) {
        if (existing) {
          throw new Error('Username already exists');
        }
      });
    }
  },
  // validateExistingMobile: function(model, attrs, options) {
  //   if (this.hasChanged('mobile')) {
  //     return User.query('where', 'mobile', this.get('mobile')).fetch().then(function(existing) {
  //       if (existing) {
  //         throw new Error('Phone number already exists');
  //       }
  //     });
  //   }
  // },
 
  hashPassword: function(model, attrs, options) {
    if(!model.has('providerId')){
      return new Promise(function(resolve, reject) {
        return bcrypt.hash(model.get('password'), 10, function(err, hash) {
          if (err) {
            reject(err);
          }
          model.unset('password');
          model.unset('confirm_password');
          model.set('encrypted_password', hash);
          return resolve(hash);
        });
      });
    }
  },
  updatePassword: function(model, attrs, options) {
    if(!model.has('providerId')){
      return new Promise(function(resolve, reject) {
        if (model.has('new_password')) {
          return bcrypt.hash(model.get('new_password'), 10, function(err, hash) {
            if (err) {
              reject(err);
            }
            model.unset('new_password');
            model.unset('old_password');
            model.unset('confirm_password');
            model.set('encrypted_password', hash);
            return resolve(hash);
          });
        } else {
          return resolve(null);
        }
      });
    }
  },
 

}, {
  comparePassword: function(password, user, cb) {
    return bcrypt.compare(password, user.get('encrypted_password'), function(err, match) {
      if (err) {
        cb(err);
      }
      if (match) {
        return cb(null, true);
      } else {
        return cb(err);
      }
    });
  }
});

module.exports = Bookshelf.model('User', User);

