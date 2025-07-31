import express from 'express';
import { getAppInfo } from '../controller/appInfoController.js';

const router = express.Router();

router.get('/appInfo', getAppInfo);

export default router;