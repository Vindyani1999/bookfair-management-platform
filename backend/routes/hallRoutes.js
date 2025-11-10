const express = require('express');
const router = express.Router();
const {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
} = require('../controllers/hallController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');


// Access: user or admin
router.get('/', authenticate, authorizeRoles('user', 'admin'), getAllHalls);

// Access: user only
router.get('/:id', authenticate, authorizeRoles('user'), getHallById);

// Access: admin only
router.post('/', authenticate, authorizeRoles('admin'), createHall);

// Access: admin only
router.put('/:id', authenticate, authorizeRoles('admin'), updateHall);

// Access: admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteHall);

module.exports = router;
