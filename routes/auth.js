let auth, express, passport, router;

express = require('express');

router = express.Router();

auth = require('../app/controllers/AuthController');

passport = require('passport');

let paramValidation =  require('../app/models/model_validations');
let validate = require('express-validation');

router.post('/login', passport.authenticate('local', {
  session: false
}), auth.login);
// , validate(paramValidation.loginValidationSchema)

router.post('/register', auth.register);
router.get('/activate', auth.activate);

router.post('/send_reset_password', auth.sendResetPassword);
router.post('/reset_password', auth.resetPassword);
router.post('/verify_token', auth.verifyToken);
router.post('/sms', auth.smsverify);
router.post('/social_register', auth.socialRegister);


module.exports = router;
