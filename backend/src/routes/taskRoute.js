import express from 'express';
import { getTask, getDailyTask, updateTaskStatus, fetchEventTask, fetchEventTaskUser, createEventTask } from '../controller/taskController.js';

const router = express.Router();

router.post('/getTask', getTask);
router.get('/getDailyTask', getDailyTask);
router.post('/updateTaskStatus', updateTaskStatus);
router.get('/fetchEventTask', fetchEventTask);
router.get('/fetchEventTaskUser/:userID/:taskIDs', fetchEventTaskUser);
router.post('/createEventTask', createEventTask);

export default router;