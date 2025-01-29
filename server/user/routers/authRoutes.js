const express = require('express');
const { login, register, tokenCheck } = require('../controllers/authController');
const protect = require('../../middlewares/authMiddleware')
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/token-check', protect, tokenCheck)

module.exports = router;