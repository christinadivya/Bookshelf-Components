/**
 * jwToken
 * @description :: JSON Webtoken Service
 * @help        :: See https://github.com/auth0/node-jsonwebtoken
 */
let jwt, tokenSecret;

jwt = require('jsonwebtoken');

// tokenSecret = require('../../config/config').tokenSecret;
tokenSecret = "jsf78(*&*#&#kjsfksdf@#@$jsejfdsjkJDFJDKJFkkjwej44werew";

module.exports.issue = function(payload) {
  return jwt.sign(payload, tokenSecret, {
    expiresIn: 10800
  });
};

module.exports.verify = function(token, callback) {
  return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    // {ignoreExpiration: true}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};


module.exports.issueTime = function(payload) {
  return jwt.sign(
    payload,
    tokenSecret, // Token Secret that we sign it with
    {
      expiresIn : 3600 // Token Expire time in seconds
    }
  );
};