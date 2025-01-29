const express = require('express');
const { getConnection, pendingUser, acceptUser, blockUser, unblockUser } = require('../controllers/connectionsController');
const protect = require('../../middlewares/authMiddleware'); 
const router = express.Router();

router.get('/:id', protect, getConnection)
router.post('/pending', protect, pendingUser)
router.post('/accept', protect, acceptUser)
router.post('/block', protect, blockUser)
router.post('/unblock', protect, unblockUser)

module.exports = router;