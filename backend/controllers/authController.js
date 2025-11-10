const User = require('../models/user');
//const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redisClient = require('../config/redisClient');
const { sendOtpEmail } = require('../utils/emailService');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new vendor
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { businessName, contactPerson, email, phoneNumber, businessAddress, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      businessName,
      contactPerson,
      email,
      phoneNumber,
      businessAddress,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Vendor registered successfully',
      user: {
        id: user.id,
        businessName: user.businessName,
        contactPerson: user.contactPerson,
        email: user.email,
        phoneNumber: user.phoneNumber,
        businessAddress: user.businessAddress,
        createdAt: user.createdAt,
      }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login a vendor
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        businessName: user.businessName,
        contactPerson: user.contactPerson,
        email: user.email,
        phoneNumber: user.phoneNumber,
        businessAddress: user.businessAddress,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};




const OTP_TTL = parseInt(process.env.OTP_TTL_SECONDS || '300', 10); 
const OTP_RATE_LIMIT = parseInt(process.env.OTP_MAX_REQUESTS_PER_HOUR || '5', 10);

function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) otp += digits[Math.floor(Math.random() * 10)];
  return otp;
}

async function incrementRateLimit(key, windowSeconds = 3600) {
  const v = await redisClient.incr(key);
  if (v === 1) {
    await redisClient.expire(key, windowSeconds);
  }
  return v;
}

/**
 * POST /api/v1/auth/forgot
 * @desc    Forgot password: send OTP to email
 * @access  Public
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const rateKey = `pwd_otp_rl:${email}`;
    const reqCount = await incrementRateLimit(rateKey, 60 * 60);

    if (reqCount > OTP_RATE_LIMIT) {
      return res.status(429).json({ message: 'Too many OTP requests. Try again later.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, an OTP was sent.' });
    }

    const otp = generateOtp(6);
    const otpKey = `pwd_otp:${email}`;
    await redisClient.setEx(otpKey, OTP_TTL, otp);

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: 'If that email exists, an OTP was sent.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

/**
 * POST /api/v1/auth/verify-otp
 * @desc    Verify OTP and issue reset token
 * @access  Public
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const otpKey = `pwd_otp:${email}`;
    const savedOtp = await redisClient.get(otpKey);
    if (!savedOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

    if (savedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await redisClient.del(otpKey);

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    return res.status(200).json({ message: 'OTP verified', resetToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

/**
 * POST /api/v1/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, email } = req.body || {};
    let tokenEmail = email;

    if (!newPassword) return res.status(400).json({ message: 'New password is required' });

    if (resetToken) {
      try {
        const payload = jwt.verify(resetToken, process.env.JWT_SECRET);
        tokenEmail = payload.email;
      } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
    }

    if (!tokenEmail) return res.status(400).json({ message: 'Email or reset token required' });

    const user = await User.findOne({ where: { email: tokenEmail } });
    if (!user) return res.status(400).json({ message: 'Invalid request' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashed });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};


// /**
//  * @route   POST /api/v1/admins/login1
//  * @desc    Login a admin
//  * @access  Public
//  */
// exports.loginAdmin = async (req, res) => {
//   try {
//     const { adminName, password } = req.body || {};

//     const admin = await Admin.findOne({ where: { adminName } });
//     if (!admin) return res.status(400).json({ message: 'Invalid user name or password' });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid user name or password' });  

//     const token = jwt.sign(
//       { id: admin.id, adminName: admin.adminName, adminRole: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({
//       message: 'Login successful',
//       admin: {
//         id: admin.id,
//         adminName: admin.adminName,
//         adminRole: admin.role
//       },
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error logging in', error: error.message });
//   }
// };


// /**
//  * @route   POST /api/v1/admins/register1
//  * @desc    Register a new admin
//  * @access  Public
//  */
// exports.registerAdmin = async (req, res) => {
//   try {
//     const { adminName, password, role } = req.body

//     if (!adminName || !password ) {
//       return res.status(400).json({ message: 'User name and password are required' });
//     }

//     const existingUser = await Admin.findOne({ where: { adminName } });
//     if (existingUser) return res.status(400).json({ message: 'User name already exists' });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const admin = await Admin.create({
//       adminName,
//       password: hashedPassword,
//       role
//     });

//     res.status(201).json({
//       message: 'admin registered successfully',
//       user: {
//         id: admin.id,
//         adminName: admin.adminName,
//         role: admin.role
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// };