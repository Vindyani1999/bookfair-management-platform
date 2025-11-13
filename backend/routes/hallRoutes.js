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
  updateHallImage,
  getImageUrl
} = require('../controllers/hallController');

const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Add Multer setup
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// Access: user or admin
router.get('/', authenticate, authorizeRoles('user', 'admin'), getAllHalls);
router.get('/:id', authenticate, authorizeRoles('user', 'admin'), getHallById);
router.get('/:id/image', authenticate, authorizeRoles('user', 'admin'), getImageUrl);

// Access: admin only
router.post('/', authenticate, authorizeRoles('admin'), createHall);
router.put('/:id', authenticate, authorizeRoles('admin'), updateHall);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteHall);
router.post('/:id/image', authenticate, authorizeRoles('admin'), upload.single('image'), uploadHallImage);
router.put('/:id/image', authenticate, authorizeRoles('admin'), upload.single('image'), updateHallImage);


module.exports = router;
