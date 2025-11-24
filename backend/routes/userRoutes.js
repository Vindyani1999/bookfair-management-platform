const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Access: admin
router.get('/', authenticate, authorizeRoles('admin'), getAllUsers);   
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteUser);

// Access: user or admin
router.put('/:id', authenticate, authorizeRoles('admin', 'user'), updateUser);       
router.get('/:id', authenticate, authorizeRoles('admin', 'user'), getUserById);  
    
module.exports = router;