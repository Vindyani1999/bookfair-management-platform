const User = require('../models/user');
const { encryptPassword } = require('../helpers/crypto');


/**
 * @desc Get all users
 * @route GET http://localhost:5000/api/v1/users/
 * @access Public
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


/**
 * @desc Get a user
 * @route GET http://localhost:5000/api/v1/users/id
 * @access Public
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

/**
 * @desc Update a user
 * @route PUT http://localhost:5000/api/v1/users/id
 * @access Public
 */
exports.updateUser = async (req, res) => {
  try {
    const { businessName, contactPerson, email, phoneNumber, businessAddress, password } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedData = {
      businessName: businessName || user.businessName,
      contactPerson: contactPerson || user.contactPerson,
      email: email || user.email,
      phoneNumber: phoneNumber || user.phoneNumber,
      businessAddress: businessAddress || user.businessAddress,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    await user.update(updatedData);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        businessName: user.businessName,
        contactPerson: user.contactPerson,
        email: user.email,
        phoneNumber: user.phoneNumber,
        businessAddress: user.businessAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};



/**
 * @desc Delete a user
 * @route DELETE http://localhost:5000/api/v1/users/id
 * @access Public
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

