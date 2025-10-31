const { body, validationResult } = require('express-validator');

exports.registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  body('businessName')
    .notEmpty()
    .withMessage('Business name is required'),
  
  body('contactPerson')
    .notEmpty()
    .withMessage('Contact person is required'),
  
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required'),

  body('businessAddress')
    .notEmpty()
    .withMessage('Business address is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

