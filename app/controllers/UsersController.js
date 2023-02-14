let Email, User, changePasswordSchema, pick, toJSON, otpGenerator;
User = require('../models/user');
changePasswordSchema = require('../models/model_validations').changePasswordSchema;
toJSON = require('utils-error-to-json');
Email = require('../services/Email');
pick = require('lodash/pick');
otpGenerator = require('otp-generator');
let config = require('../../config/config');

map = require ('lodash/map');
each = require ('lodash/each');

module.exports = {

  myProfile: function(req, res) {
    User.forge({id: req.user.id}).fetch().then(function(user) {
      res.status(200).json({
        status: "Success",
        user: user
      });
    })["catch"](function(err) {
      failureHandler(400, err, res);
    });
  },

  update: function(req, res) {
    console.log("@@@@@@@@")
    if(req.body.email != "" && req.body.email != undefined && req.body.email != null){
      req.user.save(req.body, {
        patch: true
      }).then(function(updatedUser) {      
        User.forge({
          id: req.user.id
        }).fetch().then(function(newUser) {
          res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: 'User updated successfully',
            user: newUser
          });
        });
      })["catch"](function(err) {
        if (!toJSON(err).isJoi) {
          err = toJSON(err).message;
        }
        failureHandler(400, err, res);
      });
    }else{
      failureHandler(400, 'Email required!', res);
    }
  },

  index: function(req, res) {
    User.forge().orderBy('created_at', 'DESC').fetchAll({
      withRelated: ['role']
    }).then(function(users) {
      res.status(200).json({
        status: "Success",
        statusCode: 200,
        users: users
      });
    });
  },

  changePassword: function(req, res) {
    changePasswordSchema.validate(req.body, function(err, value) {
      if (err) {
        res.json(err);
      } else {
        User.comparePassword(req.body.old_password, req.user, function(err, valid) {
          if (err) {
            failureHandler(403, 'Forbidden', res);
          }
          if (!valid) {
            failureHandler(400, 'Invalid Old Password', res);
          }
          if (valid) {
            req.user.save(req.body).then(function(user) {
              successHandler(200, 'Password changed successfully', res);
            })["catch"](function(err) {
              failureHandler(400, err, res);
            });
          }
        });
      }
    });
  }
};


function failureHandler(code, data, res){
  // if (!toJSON(data).isJoi) {
  //   data = toJSON(data).message;
  // }
  res.status(200).json({
    status: "Failed",
    statusCode: code,
    message: data
  });
}

function successHandler(code, data, res){
  res.status(code).json({
    status: "Success",
    statusCode: code,
    message: data
  });
}
