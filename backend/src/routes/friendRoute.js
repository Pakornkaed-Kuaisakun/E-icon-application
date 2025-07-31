import express from 'express';
import { AddFriend, searchUser, getFriendRequestStatus, getFriendRequest, requestAccept, getFriendData } from '../controller/friendController.js';

const router = express.Router();

router.post('/add', AddFriend);
router.get('/search/:email', searchUser);
router.get('/getFriendRequestStatus', getFriendRequestStatus);
router.get('/getFriendRequest/:senderID', getFriendRequest);
router.post('/requestAccept', requestAccept);
router.get('/getFriendData/:userid', getFriendData);

export default router;