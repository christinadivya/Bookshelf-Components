let Joi, changePasswordSchema, resetPasswordSchema,userValidationSchema, socialUserValidationSchema, categoryValidationSchema;
Joi = require('joi');


categoryValidationSchema = Joi.object().keys({
  name: Joi.string().required().label('Category Name'),
}).options({
  abortEarly: false,
  allowUnknown: true
});

socialUserValidationSchema = Joi.object().keys({
  fullname: Joi.string().required().label('Full Name'),
  // email: Joi.string().email().required().label('Email'),
  providerId: Joi.string().required().label('Provider Id'),
  providerName: Joi.string().required().valid('Twitter', 'Facebook', 'Instagram').label('Provider Name'),
}).options({
  abortEarly: false,
  allowUnknown: true
});


userValidationSchema = Joi.object().keys({
  userName: Joi.string().required().label('userName'),
  // lastname: Joi.string().required().label('Lastname'),
  email: Joi.string().email().required().label('Email'),
  gender: Joi.string().valid('Male', 'Female').label('Gender'),
  location: Joi.string().label('Location'),
  role_id: Joi.number().required().label('Role'),
  // mobile: Joi.number().min(8).required().label('Phone'),
  password: Joi.string().regex(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/).required().options({
    language: {
      string: {
        regex: {
          base: 'must be 8 characters with 1 number, 1 special character, no spaces'
        }
      },
      label: 'Password'
    }
  }),
  confirm_password: Joi.any().valid(Joi.ref('password')).required().options({
    language: {
      any: {
        allowOnly: 'must match password'
      },
      label: 'Password Confirmation'
    }
  })
}).options({
  abortEarly: false,
  allowUnknown: true
});

loginValidationSchema = Joi.object().keys({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password'),
}).options({
  abortEarly: false,
  allowUnknown: true
});


resetPasswordSchema = Joi.object().keys({
  new_password: Joi.string().regex(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/).required().options({
    language: {
      string: {
        regex: {
          base: 'must be 8 characters with 1 number, 1 special character, no spaces'
        }
      },
      label: 'New password'
    }
  }),
  confirm_password: Joi.any().valid(Joi.ref('new_password')).required().options({
    language: {
      any: {
        allowOnly: 'must match password'
      },
      label: 'Password Confirmation'
    }
  })
}).options({
  abortEarly: false,
  allowUnknown: true
});

changePasswordSchema = Joi.object().keys({
  old_password: Joi.string().required(),
  new_password: Joi.string().regex(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/).required().options({
    language: {
      string: {
        regex: {
          base: 'must be 8 characters with 1 number, 1 special character, no spaces'
        }
      },
      label: 'New password'
    }
  }),
  confirm_password: Joi.any().valid(Joi.ref('new_password')).required().options({
    language: {
      any: {
        allowOnly: 'must match password'
      },
      label: 'Password Confirmation'
    }
  })
}).options({
  abortEarly: false,
  allowUnknown: true
});


module.exports = {
  userValidationSchema: userValidationSchema,
  changePasswordSchema: changePasswordSchema,
  resetPasswordSchema: resetPasswordSchema,
  socialUserValidationSchema: socialUserValidationSchema,
  categoryValidationSchema: categoryValidationSchema,
  loginValidationSchema: loginValidationSchema
};