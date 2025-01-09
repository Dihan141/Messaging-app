const { Server } = require('socket.io');
const User = require('../user/models/userModel')
let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', async (userId) => {
            try {
                console.log('User joined room:', userId);
                socket.join(userId);

                const user = await User.findById(userId);
                user.socketId = socket.id;
                user.active = true;
                await user.save();

                const onlineUsers = await User.find({ active: true }).select('_id name email')
                io.emit('get-online-users', onlineUsers);
            } catch (error) {
                console.error('Error joining room:', error);
            }           
        });

        socket.on('disconnect', async () => {
            try {
                const user = await User.findOne({ socketId: socket.id })
                if(user){
                    user.active = false;
                    user.lastActive = new Date();
                    await user.save();
                }

                const onlineUsers = await User.find({ active: true }).select('_id name email')
                console.log('User disconnected:', onlineUsers);
                io.emit('get-online-users', onlineUsers);
            } catch (error) {
                console.error('Error disconnecting:', error);
            }
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io instance is not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIo };
