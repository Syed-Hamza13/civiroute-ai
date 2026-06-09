const express = require('express');
const router = express.Router();
const { registerCitizen, login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerCitizen);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router; 