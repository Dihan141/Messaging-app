const express = require('express');
const { getMessages, postMessages, getLastMessages } = require('../controllers/messageController');
const protect = require('../../middlewares/authMiddleware');
const parser = require('../../config/cloudinaryConfig');
const router = express.Router();

router.get('/:receiverId', protect, getMessages);
router.post('/', protect, parser.single('file'), postMessages);
router.get('/last-messages/get', protect, getLastMessages);

module.exports = router;