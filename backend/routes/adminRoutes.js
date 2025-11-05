const express = require('express');
const router = express.Router();
const {registerAdmin,loginAdmin,refreshToken,logoutAdmin} = require('../controllers/adminController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/refresh', refreshToken);
router.post('/logout', logoutAdmin);

module.exports = router;
