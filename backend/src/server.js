import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { initDB, db } from './config/db.js';
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

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on("send_message", async (data) => {
        const { senderID, receiverID, message } = JSON.parse(data);

        try {
            const result = await db`INSERT INTO messages (senderid, receiverid, message) VALUES (${senderID}, ${receiverID}, ${message})`;

            console.log(result);

            const savedMessage = result[0];

            io.emit("receive_message", savedMessage);
        } catch (error) {
            console.error(error);
        }
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});



initDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server + WebSocket running on ${PORT}`);
    });
});
