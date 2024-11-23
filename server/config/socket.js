const { Server } = require('socket.io');
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

        socket.on('joinRoom', (userId) => {
            console.log('User joined room:', userId);
            socket.join(userId);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
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
