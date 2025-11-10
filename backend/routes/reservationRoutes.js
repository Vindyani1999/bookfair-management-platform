const express = require('express');
const router = express.Router();
const { getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation } = require('../controllers/reservationController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorizeRoles('admin'), getAllReservations);
router.get('/:id',authenticate, authorizeRoles('admin', 'user'), getReservationById);
router.post('/', authenticate, authorizeRoles('user'), createReservation);
router.put('/:id', authenticate, authorizeRoles('user'), updateReservation);
router.delete('/:id', authenticate, authorizeRoles('user', 'admin'), deleteReservation);

module.exports = router;
