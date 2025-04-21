import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app)

const allowedOrigin = process.env.CORS_ORIGIN_PORT;

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        credentials: true
    }
})

export function getReciverSocketId(userId)  {
return userSocketMap[userId]
}

// For store online user
const userSocketMap = {}

io.on('connection', (socket) => {
    // console.log('User connected', socket.id)
    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
    socket.on('disconnect', () => {
        // console.log('User disconnected', socket.id)
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

export { io, app, server }
