const express = require('express');
const router = express.Router();
const { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorizeRoles('admin'), getAllTransactions);
router.get('/:id', authenticate, authorizeRoles('admin', 'user'), getTransactionById);
router.post('/', authenticate, authorizeRoles('user'), createTransaction);
router.put('/', authenticate, authorizeRoles('user'), updateTransaction);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteTransaction);

module.exports = router;
