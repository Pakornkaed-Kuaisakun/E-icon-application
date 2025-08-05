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