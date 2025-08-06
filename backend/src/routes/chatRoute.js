import express from 'express';
import { chatHistory, markRead, newMessageUnread } from '../controller/chatController.js';

const router = express.Router();

router.get('/history', chatHistory);
router.post('/markRead', markRead);
router.get('/newMessage', newMessageUnread);

export default router;