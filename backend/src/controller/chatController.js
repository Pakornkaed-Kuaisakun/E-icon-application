import { pool } from '../config/db.js';

export async function sendMessage(req, res) {
    const { senderID, receiverID, message } = req;
    try {
        const result = await pool`INSERT INTO messages (senderid, receiverid, message) VALUES (${senderID}, ${receiverID}, ${message})`;
        
    } catch (error) {

    }
}