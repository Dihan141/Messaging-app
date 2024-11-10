const express = require('express')
const { getUsersBySearch } = require('../controllers/userController')
const router = express.Router()

router.get('/:query', getUsersBySearch)

module.exports = router