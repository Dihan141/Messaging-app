const express = require('express');
const { getMessages, postMessages } = require('../controllers/messageController');
const router = express.Router();

router.get('/', getMessages);
router.post('/', postMessages);

module.exports = router;