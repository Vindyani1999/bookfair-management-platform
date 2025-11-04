const express = require('express');
const router = express.Router();
const { getAllHalls, updateHall } = require('../controllers/hallController');

router.get('/', getAllHalls);
router.put('/:id', updateHall);

module.exports = router;
