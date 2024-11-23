require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { createServer } = require('http')
const { initSocket } = require('./config/socket')
const app = express()
const server = createServer(app)

//routes
const authroutes = require('./user/routers/authRoutes');
const userRoutes = require('./user/routers/userRoutes');
const messageRoutes = require('./message/routers/messageRoutes');
const connectionRoutes = require('./connections/routers/connectionRoutes');

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
app.use('/api/connections', connectionRoutes)

initSocket(server)

server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})