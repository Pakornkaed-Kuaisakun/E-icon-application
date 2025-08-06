import { db } from '../config/db.js';

export async function chatHistory(req, res) {
    try {
        const result = await db`SELECT * FROM messages WHERE (senderid = ${req.query.senderID} AND receiverid = ${req.query.receiverID}) OR (senderid = ${req.query.receiverID} AND receiverid = ${req.query.senderID}) ORDER BY created_at ASC`;

        // console.log(result);

        if(result) {
            return res.status(200).json({ result });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

export async function markRead(req, res) {
    const { senderID, receiverID } = req.body;

    try {
        const result = await db`UPDATE messages SET read = true WHERE senderid = ${senderID} AND receiverid = ${receiverID} AND read = false`;

        console.log(result);

        return res.status(200).json({ success: true, updated: result });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export async function newMessageUnread(req, res) {
    try {
        const fetch = await db`SELECT * FROM messages WHERE senderid = ${req.query.friendID} AND receiverid = ${req.query.userID} AND read = false ORDER BY created_at DESC LIMIT 1`;

        // console.log(fetch);

        if(fetch) {
            return res.status(200).json({ newMessage: fetch });
        } else {
            return res.status(200).json({ newMessage: null });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}