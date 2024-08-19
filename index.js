const express = require('express')
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express()
app.use(cors());
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path: '../config.env'})

const connectDb = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/erroMiddleware');
connectDb()

// const chats = require('./data/data');

app.get('/', (req, res) => {
    res.send('Home page is running')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5050

const server = app.listen(PORT, console.log(`App is runing @port: ${PORT}`))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'https://gossip-frontend-sigma.vercel.app'
    }
})

io.on('connection', (socket) => {
    console.log('Connected to socket.io')
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('user joined room: ' + room)
    })

    socket.on('typing', (room) => {
        socket.in(room).emit('typing')
    })

    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing')
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat
        if(!chat.users) return console.log('chat.users not defined')

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return

            socket.in(user._id).emit('message recieved', newMessageReceived)
        })
    })

    socket.off('setup', () => {
        console.log('USER DISCONNECTED')
        socket.leave(userData._id)
    })
})