import express from 'express';
import { getProofTask, ConfirmImage, RejectImage } from '../controller/photoController.js';

const router = express.Router();

router.get('/getProofTask/:userid', getProofTask);
router.post('/ConfirmImage', ConfirmImage);
router.post('/RejectImage', RejectImage);

export default router;