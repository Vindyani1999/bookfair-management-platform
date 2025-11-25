const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');

const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate Access & Refresh Tokens
 */
function generateTokens(admin) {
  const accessToken = jwt.sign(
    { id: admin.id, adminName: admin.adminName, role: admin.role || 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: admin.id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

/**
 * @route   POST /api/v1/admins/register
 * @desc    Register a new admin
 * @access  Public
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { adminName, password, role } = req.body;
    if (!adminName || !password)
      return res.status(400).json({ message: 'Admin name and password are required' });

    const existing = await Admin.findOne({ where: { adminName } });
    if (existing) return res.status(400).json({ message: 'Admin name already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ adminName, password: hashed, role });

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { id: admin.id, adminName: admin.adminName, role: admin.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

/**
 * @route   POST /api/v1/admins/login
 * @desc    Admin login (returns access + refresh tokens)
 * @access  Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { adminName, password } = req.body;
    if (!adminName || !password)
      return res.status(400).json({ message: 'Admin name and password are required' });

    const admin = await Admin.findOne({ where: { adminName } });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(admin);

    await redisClient.setEx(`refresh:${admin.id}`, 7 * 24 * 60 * 60, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      admin: { id: admin.id, adminName: admin.adminName, role: admin.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

/**
 * @route   POST /api/v1/admins/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    const stored = await redisClient.get(`refresh:${decoded.id}`);
    if (!stored || stored !== refreshToken)
      return res.status(403).json({ message: 'Invalid or expired refresh token' });

    const admin = await Admin.findByPk(decoded.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(admin);

    await redisClient.setEx(`refresh:${admin.id}`, 7 * 24 * 60 * 60, newRefreshToken);

    res.status(200).json({
      message: 'Token refreshed',
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid refresh token', error: error.message });
  }
};

/**
 * @route   POST /api/v1/admins/logout
 * @desc    Logout admin (invalidate refresh token)
 * @access  Public
 */
exports.logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    await redisClient.del(`refresh:${decoded.id}`);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error logging out', error: error.message });
  }
};
