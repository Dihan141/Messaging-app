const express = require('express');
const { getConnections } = require('../controllers/connectionsController');
const protect = require('../../middlewares/authMiddleware'); 
const router = express.Router();

router.get('/', protect, getConnections)
router.post('/', protect, () => {})

module.exports = router;