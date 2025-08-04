import express from 'express';
import { getProofTask } from '../controller/photoController.js';

const router = express.Router();

router.get('/getProofTask/:userid', getProofTask);

export default router;