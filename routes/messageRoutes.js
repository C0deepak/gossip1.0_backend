const express = require('express')
const router = express.Router()
const { auth } = require('../middlewares/authMiddleware')
const { sendMessage, allMessage } = require('../controllers/messageController')

router.route('/').post(auth, sendMessage)
router.route('/:chatId').get(auth, allMessage)

module.exports = router