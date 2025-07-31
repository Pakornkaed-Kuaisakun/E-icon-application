import express from 'express';
import { getDashboardData, useGrowTree, changePassword } from '../controller/dashboardController.js';

const router = express.Router();

router.get('/:userid', getDashboardData);
router.post('/growTree', useGrowTree);
router.post('/changePassword', changePassword);

export default router;