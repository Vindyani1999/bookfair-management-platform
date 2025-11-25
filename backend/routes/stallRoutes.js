const express = require('express');
const router = express.Router();
const {
  getAllStalls,
  getStallById,
  createStall,
  updateStall,
  deleteStall,
  getStallsByHallId,
} = require('../controllers/stallController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Access: user or admin
router.get('/hall/:hallId', authenticate, authorizeRoles('admin', 'user'), getStallsByHallId);
router.get('/:id', authenticate, authorizeRoles('admin', 'user'), getStallById);

// Access: admin
router.get('/', authenticate, authorizeRoles('admin'), getAllStalls);
router.post('/',authenticate, authorizeRoles('admin'), createStall);
router.put('/:id', authenticate, authorizeRoles('admin'), updateStall);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteStall);


module.exports = router;
