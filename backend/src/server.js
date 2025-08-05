import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { initDB } from './config/db.js';
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

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

let messages = [];

io.on('connection', (socket) => {
    console.log('Connected WebSocket');

    socket.emit('chat_history', messages);

    socket.on('send_message', (data) => {
        const message = {
            id: Date.now(),
            time: new Date().toISOString(),
        };
        messages.push(message);

        io.emit('receive_message', message); // broadcast to all
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
})

initDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server + WebSocket running on ${PORT}`);
    });
});
