import express from 'express';
import { getProofTask, getImage } from '../controller/photoController.js';

const router = express.Router();

router.get('/getProofTask/:userid', getProofTask);
router.get('/getImage/:userid', getImage);

export default router;