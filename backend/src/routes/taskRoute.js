import express from 'express';
import { getTask, getDailyTask, updateTaskStatus } from '../controller/taskController.js';

const router = express.Router();

router.post('/getTask', getTask);
router.get('/getDailyTask', getDailyTask);
router.post('/updateTaskStatus', updateTaskStatus);

export default router;