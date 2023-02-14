let User, jwToken, toJSON, Email, otpGenerator, resetPasswordSchema;
SMS=require('../services/SMS')
jwToken = require('../services/jwToken');
User = require('../models/user');
toJSON = require('utils-error-to-json');
Email = require ('../services/Email');
resetPasswordSchema = require('../models/model_validations').resetPasswordSchema;
otpGenerator = require('otp-generator');

// let jwToken = require('../services/jwToken');
let jwt_decode = require('jwt-decode');
let config = require('../../config/config');
let jwt = require('jsonwebtoken');

module.exports = {

  socialRegister: function(req, res) {
    User.where({
      email: req.body.email,
      providerName: req.body.providerName
    }).fetch().then(function(user_dat) {
      if (!user_dat) {
        registerUser(req, res, false); //register
      } else {
        User.where({
          email: req.body.email,
          providerId: req.body.providerId,
          providerName: req.body.providerName          
        }).fetch().then(function(validUser) {
          if(validUser){
            loginUser(req, res, user_dat); //login             
          }else{
            if (user_dat.get('providerId') == null ){
              failureHandler(400, 'Email already exists!', res);
            }else{
              failureHandler(400, 'Invalid ProviderId!', res);              
            }
          }
        })["catch"](function(err) {
          failureHandler(400, err, res);
        });
      }
    })["catch"](function(err) {
      failureHandler(400, err, res);
    });
  },  

  activate: function(req, res) {
    let key = req.query.token; 
    User.where({
      activationToken: key,
      emailConfirmation: 0
    }).fetch().then(function(user_dat) {
      if (!user_dat) {
        failureHandler(400, 'Activated done already!', res);
      } else {
        user_dat.save({emailConfirmation: 1, role_id: 2}, { //set role as user
          patch: true
        }).then(function(updatedUser) {
          successHandler(200, 'Your account is activated!', res);          
        })["catch"](function(err) {
          failureHandler(400, err, res);
        });
      }
    })["catch"](function(err) {
      failureHandler(400, err, res);
    });
  },

  login: function(req, res) {
    
    if (req.user.err) {
      return res.status(400).json({
        message: req.user.err
      });
    } else {

      const criteria = req.body.email.indexOf('@') === -1 ? {
        userName: req.body.email
      } : {
        email: req.body.email
      };
console.log(criteria)
      User.where(criteria).fetch().then(function(user_dat) {
        if (!user_dat) {
          failureHandler(400, 'Invalid User!', res);      
        } else {

          User.comparePassword(req.body.password, req.user, function(err, valid) {
            if (err) {
              failureHandler(403, 'Forbidden', res);
            }
            if (!valid) {
              failureHandler(400, 'Invalid Password', res);
            }
            if (valid) {
              loginSuccessHandler(req, res, req.user);
            }
          });
        }
      });      
    }
  },

  register: function(req, res) {
    // req.body.profileImage = config.rootUrl+'images/avatar.png';
    registerUser(req, res, true);
  },  

  sendResetPassword: function(req, res) {
    let findData,tokenOTP
    if(req.body.email)
    {
      findData={email:req.body.email}
    }else if(req.body.mobile){
      findData={mobile:req.body.mobile}
    }
    User.where(findData).fetch().then(function(user) { 
     
      if (!user) {
        // failureHandler(400, 'Invalid email!', res);
        res.status(200).json({
          status: "Failed",
          statusCode: 400,
          message: 'Invalid Entry!'
        });

      } else {
         let  OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false })
        
       
        if(req.body.email)
        {
          // OTP = jwToken.issueTime({fkey: user.get('email')});

          tokenOTP={mailOTP:OTP}
        }else if(req.body.mobile){
          tokenOTP={mobileOTP:OTP}
        }
        user.save(tokenOTP).then(function(updatedUser) {
         let userData=user.toJSON()
         console.log(userData)
          if(req.body.email)
        {
          Email.mailOTP(userData, OTP)
        }else if(req.body.mobile){
          SMS.smsOTP(userData, OTP)
        }
         
          res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: 'successfully sent OTP!',
            token: OTP
          });
        })["catch"](function(err) {
          failureHandler(400, err, res);
        });
      }      
    });
  },

  smsverify: function(req, res) {
    User.where({
      mobile: req.body.mobile
   }).fetch().then(function(user) {
   
    
     if (!user) {
       // failureHandler(400, 'Invalid email!', res);
       res.status(200).json({
         status: "Failed",
         statusCode: 400,
         message: 'Invalid Mobile Number! ' 
       });

     } else {
       
  
         SMS.sendSMS(user.get('mobile'),
         function(err, doc) {
         });
         res.status(200).json({
           status: "Success",
           statusCode: 200,
           message: 'SMS sent!',
          //  token: doc
         }) 
     }      
   });
 },


  verifyToken: function(req, res) {
    let key = req.body.token;
    User.where({
      activationToken: key
    }).fetch().then(function(user_dat) {
     
      if (!user_dat) {
        failureHandler(400, 'Invalid Token!', res);
      } else {
        successHandler(200, 'Valid Token!', res);  
      }
    })["catch"](function(err) {
      failureHandler(400, err, res);
    });
  },

 


  resetPassword: function(req, res) {

    jwToken.verify(req.body.token, (err, result) => { 
     if(err){
      failureHandler(400, err, res);
     }else{
        let passwordFields = {
          new_password: req.body.new_password,
          confirm_password: req.body.confirm_password
        }
        resetPasswordSchema.validate(passwordFields, function(err, value) {
          if (err) {
            if (!toJSON(err).isJoi) {
              err = toJSON(err).message;
            }
            failureHandler(400, err, res);
          } else {
            let key = req.body.token;
            User.where({
              activationToken: key
            }).fetch().then(function(user_dat) {
              if (!user_dat) {
                failureHandler(400, 'Invalid Token!', res);
              }else {
                user_dat.save(passwordFields).then(function(user) {
                  successHandler(200, 'Password changed successfully', res);
                })["catch"](function(err) {
                  failureHandler(400, err, res);
                });
              }
            })["catch"](function(err) {
              failureHandler(400, err, res);
            });
          }
        });
     }
    });

  }
};

function loginUser(req, res, socialUser){
  if(socialUser == null){
    if (req.user.err) {
      failureHandler(400, req.user.err, res);
    } else if(req.user.get('emailConfirmation')) {
      loginSuccessHandler(req, res, req.user);
    }else{
      failureHandler(400, "Inactive account", res);
    }
  }else{
    loginSuccessHandler(req, res, socialUser);
  }
}

function loginSuccessHandler(req, res, usr){

  res.status(200).json({
    status: "Success",
    statusCode: 200,
    user: usr,
    token: 'JWT ' + jwToken.issue({
      id: usr.id
    })
  });
}

function registerUser(req, res, sendActivationMail){
  User.forge(req.body).save().then(function(user) {
    User.where({
      id: user.id
    }).fetch({withRelated: ['role']}).then(function(new_user) {
      let token='JWT ' + jwToken.issue({id: new_user.id})
      let options=new_user.toJSON()

      Email.activateEMAIL(options)
      SMS.activateSMS(options)
      // SMS.firebase(options,token)
      res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: 'Successfully created new user',
        user: new_user,
        token: 'JWT ' + jwToken.issue({
          id: new_user.id
        })
      });
    });

  })["catch"](function(err) {
    failureHandler(400, err, res);
  });
}

function failureHandler(code, data, res){
  if (!toJSON(data).isJoi) {
    data = toJSON(data).message;
  }
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