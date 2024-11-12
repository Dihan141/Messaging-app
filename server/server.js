require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { createServer } = require('http')
const { Server } = require('socket.io') 
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow only your React app's origin
        methods: ['GET', 'POST'],
        credentials: true
    }
})

//routes
const authroutes = require('./user/routers/authRoutes');
const userRoutes = require('./user/routers/userRoutes');
const messageRoutes = require('./message/routers/messageRoutes');

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err);
});

app.use('/api/auth', authroutes)
app.use('/api/user', userRoutes)
app.use('/api/messages', messageRoutes)

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', (data) => {
        console.log('Message received:', data);
        io.emit('message', data); // Broadcast the message to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})

server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})