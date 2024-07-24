const Message = require('../models/messageSchema')
const asyncHandler = require('express-async-handler')
const User = require('../models/userSchema')
const Chat = require('../models/chatSchema')

const sendMessage = asyncHandler(async (req, res) => {
    const { content, receiver } = req.body

    if (!content || !receiver) {
        console.log('Invalid data passed')
        return res.status(400)
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: receiver
    }

    try {
        var message = await Message.create(newMessage)

        message = await message.populate('sender', 'name pic')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })

        await Chat.findByIdAndUpdate(req.body.receiver, {
            latestMessage: message
        })

        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name pic email').populate('chat')
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = { sendMessage, allMessage }