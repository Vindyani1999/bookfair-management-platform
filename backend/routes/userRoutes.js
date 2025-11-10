const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');


router.get('/', authenticate, authorizeRoles('admin'), getAllUsers);         
router.get('/:id', authenticate, authorizeRoles('admin, user'), getUserById);      
router.put('/:id', authenticate, authorizeRoles('admin'), updateUser);       
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteUser);    

module.exports = router;