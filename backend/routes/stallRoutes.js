const express = require('express');
const router = express.Router();
const {
  getAllStalls,
  getStallById,
  createStall,
  updateStall,
  deleteStall,
} = require('../controllers/stallController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Access: user or admin
router.get('/', authenticate, authorizeRoles('admin', 'user'), getAllStalls);
router.get('/:id', authenticate, authorizeRoles('admin', 'user'), getStallById);

// Access: admin
router.post('/',authorizeRoles('admin', 'user'), createStall);
router.put('/:id', authenticate, authorizeRoles('admin'), updateStall);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteStall);
module.exports = router;
