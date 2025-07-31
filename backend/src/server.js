import express from 'express';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { initDB } from './config/db.js'; // Adjust the path as necessary
import rateLimiter from './middleware/rateLimit.js';
import authRoute from './routes/authRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';
import friendRoute from './routes/friendRoute.js';
import rankRoute from './routes/rankRoute.js';
import taskRoute from './routes/taskRoute.js';
import photoRoute from './routes/photoRoute.js';
import appInfoRoute from './routes/appInfoRoute.js';

dotenv.config();

const app = express();

// Middleware
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 8080;


app.use('/api/auth', authRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/friends', friendRoute);
app.use('/api/rank', rankRoute);
app.use('/api/task', taskRoute);
app.use('/api/photo', photoRoute);
app.use('/api/app', appInfoRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});
