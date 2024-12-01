const express = require('express')
const { getUsersBySearch, getContacts, getUserInfo } = require('../controllers/userController')
const protect = require('../../middlewares/authMiddleware')
const router = express.Router()

router.get('/:query', getUsersBySearch)
router.get('/get/:userId', protect, getUserInfo)
router.get('/contacts/get', protect, getContacts)    

module.exports = router