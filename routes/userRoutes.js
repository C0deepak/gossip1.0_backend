const express = require('express')
const { registerUser, loginUser, allUser } = require('../controllers/userControllers')
const { auth } = require('../middlewares/authMiddleware')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/').get(auth, allUser)

module.exports = router