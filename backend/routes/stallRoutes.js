const express = require('express');
const router = express.Router();
const {
  getAllStalls,
  getStallById,
  createStall,
  updateStall,
  deleteStall,
} = require('../controllers/stallController');

router.get('/', getAllStalls);
router.get('/:id', getStallById);
router.post('/', createStall);
router.put('/:id', updateStall);
router.delete('/:id', deleteStall);

module.exports = router;
