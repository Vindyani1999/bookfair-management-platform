const express = require('express');
const router = express.Router();
const { 
  getAllHalls, 
  getHallById,
  createHall,
  updateHall,
  deleteHall 
} = require('../controllers/hallController');

// All routes are protected with auth middleware
router.get('/',  getAllHalls);
router.get('/:id',  getHallById);
router.post('/',  createHall);
router.put('/:id',  updateHall);
router.delete('/:id',  deleteHall);

module.exports = router;
