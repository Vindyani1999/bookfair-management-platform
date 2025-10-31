const express = require('express');
const router = express.Router();
const { registerUser, loginUser,  requestPasswordReset, verifyOtp, resetPassword, } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validate');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// New routes
router.post('/forgot', requestPasswordReset);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router; 
