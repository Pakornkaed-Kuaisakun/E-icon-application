import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { initDB, pool } from './config/db.js';
import rateLimiter from './middleware/rateLimit.js';
import authRoute from './routes/authRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';
import friendRoute from './routes/friendRoute.js';
import rankRoute from './routes/rankRoute.js';
import taskRoute from './routes/taskRoute.js';
import photoRoute from './routes/photoRoute.js';
import appInfoRoute from './routes/appInfoRoute.js';
import chatRoute from './routes/chatRoute.js';

dotenv.config();

const app = express();
app.use(rateLimiter);
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/friends', friendRoute);
app.use('/api/rank', rankRoute);
app.use('/api/task', taskRoute);
app.use('/api/photo', photoRoute);
app.use('/api/app', appInfoRoute);
app.use('/api/chat', chatRoute);

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// 🔥 Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('Client connected via Socket.IO');

    // Handle user authentication
    socket.on('authenticate', (userId) => {
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated and connected`);
    });

    // Handle private messages
    socket.on('send_message', async (data) => {
        try {
            const { senderId, receiverId, message } = data;
            
            // Save message to database
            const query = `
                INSERT INTO messages (senderid, receiverid, message, created_at)
                VALUES ($1, $2, $3, NOW())
                RETURNING *
            `;
            const result = await pool.query(query, [senderId, receiverId, message]);
            
            const savedMessage = result.rows[0];
            
            // Send to receiver if online
            const receiverSocketId = connectedUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', {
                    id: savedMessage.id,
                    senderId: savedMessage.senderid,
                    receiverId: savedMessage.receiverid,
                    message: savedMessage.message,
                    createdAt: savedMessage.created_at
                });
            }
            
            // Send confirmation to sender
            socket.emit('message_sent', savedMessage);
            
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        const { receiverId, isTyping } = data;
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('user_typing', {
                userId: socket.userId,
                isTyping
            });
        }
    });

    // Handle user status
    socket.on('set_status', (status) => {
        // You can implement user status logic here
        socket.broadcast.emit('user_status_change', {
            userId: socket.userId,
            status
        });
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            connectedUsers.delete(socket.userId);
            console.log(`User ${socket.userId} disconnected`);
        }
    });
});

initDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server + Socket.IO running on ${PORT}`);
    });
});
