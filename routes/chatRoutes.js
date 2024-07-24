const express = require('express')
const { auth } = require('../middlewares/authMiddleware')
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController')
const router = express.Router()

router.route('/').post(auth, accessChat)
router.route('/').get(auth, fetchChats)
router.route('/group').post(auth, createGroupChat)
router.route('/grouprename').put(auth, renameGroup)
router.route('/groupremove').put(auth, removeFromGroup)
router.route('/groupadd').put(auth, addToGroup)

module.exports = router