let UsersController, express, passport, router;

express = require('express');

router = express.Router();

UsersController = require('../app/controllers/UsersController');

passport = require('passport');


router.post('/change_password', UsersController.changePassword);
router.get('/all', UsersController.index);
router.put('/update', UsersController.update);
router.get('/my_profile', UsersController.myProfile);

module.exports = router;
