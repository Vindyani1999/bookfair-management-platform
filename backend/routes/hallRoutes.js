const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getAllHalls, 
  getHallById,
  createHall,
  updateHall,
  deleteHall 
} = require('../controllers/hallController');

// All routes are protected with auth middleware
router.get('/', auth, getAllHalls);
router.get('/:id', auth, getHallById);
router.post('/', auth, createHall);
router.put('/:id', auth, updateHall);
router.delete('/:id', auth, deleteHall);

module.exports = router;
