const express = require('express')
const { getUsersBySearch, getContacts } = require('../controllers/userController')
const protect = require('../../middlewares/authMiddleware')
const router = express.Router()

router.get('/:query', getUsersBySearch)
router.get('/contacts/get', protect, getContacts)    

module.exports = router