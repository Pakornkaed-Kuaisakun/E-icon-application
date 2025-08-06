import express from 'express';
import { getProofTask, getImage, ConfirmImage, RejectImage } from '../controller/photoController.js';

const router = express.Router();

router.get('/getProofTask/:userid', getProofTask);
router.get('/getImage/:userid', getImage);
router.post('/ConfirmImage', ConfirmImage);
router.post('/RejectImage', RejectImage);

export default router;