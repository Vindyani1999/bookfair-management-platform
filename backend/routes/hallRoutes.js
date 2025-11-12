const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  uploadHallImage,
  updateHallImage
} = require('../controllers/hallController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// ✅ Add Multer setup
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// Access: user or admin
router.get('/', authenticate, authorizeRoles('user', 'admin'), getAllHalls);

// Access: user only
router.get('/:id', authenticate, authorizeRoles('user'), getHallById);

// Access: admin only
router.post('/', authenticate, authorizeRoles('user', 'admin'), createHall);

// Access: admin only
router.put('/:id', authenticate, authorizeRoles('admin'), updateHall);

// Access: admin only
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteHall);

// ✅ Upload and Update Image routes
router.post('/:id/image', authenticate, authorizeRoles('user', 'admin'), upload.single('image'), uploadHallImage);
router.put('/:id/image', authenticate, authorizeRoles('user', 'admin'), upload.single('image'), updateHallImage);

module.exports = router;
