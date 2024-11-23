const express = require('express');
const { getMessages, postMessages } = require('../controllers/messageController');
const protect = require('../../middlewares/authMiddleware');
const router = express.Router();

router.get('/:receiverId', protect, getMessages);
router.post('/', protect, postMessages);

module.exports = router;