import express from 'express';
import { globalRank } from '../controller/rankController.js';

const router = express.Router();

router.get('/globalRank', globalRank);

export default router;