const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      { id: user.id, email: user.email },
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
