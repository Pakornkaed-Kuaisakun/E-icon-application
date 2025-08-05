import express from 'express';
import { chatHistory } from '../controller/chatController.js';

const router = express.Router();

router.get('/history', chatHistory);

export default router;