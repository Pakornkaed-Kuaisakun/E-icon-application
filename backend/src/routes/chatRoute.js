import express from 'express';
import { pool } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get conversation history between two users
router.get('/conversation/:receiverId', authenticateToken, async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.userid;

        const query = `
            SELECT 
                m.id,
                m.senderid,
                m.receiverid,
                m.message,
                m.created_at,
                u.username as sender_username,
                u2.username as receiver_username
            FROM messages m
            JOIN users u ON m.senderid = u.userid
            JOIN users u2 ON m.receiverid = u2.userid
            WHERE (m.senderid = $1 AND m.receiverid = $2)
               OR (m.senderid = $2 AND m.receiverid = $1)
            ORDER BY m.created_at ASC
        `;

        const result = await pool.query(query, [senderId, receiverId]);
        
        res.json({
            success: true,
            messages: result.rows
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch conversation'
        });
    }
});

// Get recent conversations for a user
router.get('/conversations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userid;

        const query = `
            WITH LastMessages AS (
                SELECT 
                    CASE 
                        WHEN senderid = $1 THEN receiverid
                        ELSE senderid
                    END as other_user_id,
                    message,
                    created_at,
                    ROW_NUMBER() OVER (
                        PARTITION BY 
                            CASE 
                                WHEN senderid = $1 THEN receiverid
                                ELSE senderid
                            END
                        ORDER BY created_at DESC
                    ) as rn
                FROM messages
                WHERE senderid = $1 OR receiverid = $1
            )
            SELECT 
                lm.other_user_id,
                lm.message as last_message,
                lm.created_at as last_message_time,
                u.username,
                u.email
            FROM LastMessages lm
            JOIN users u ON lm.other_user_id = u.userid
            WHERE lm.rn = 1
            ORDER BY lm.created_at DESC
        `;

        const result = await pool.query(query, [userId]);
        
        res.json({
            success: true,
            conversations: result.rows
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch conversations'
        });
    }
});

// Get unread message count
router.get('/unread/:senderId', authenticateToken, async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.user.userid;

        const query = `
            SELECT COUNT(*) as unread_count
            FROM messages
            WHERE senderid = $1 AND receiverid = $2
            AND read_at IS NULL
        `;

        const result = await pool.query(query, [senderId, receiverId]);
        
        res.json({
            success: true,
            unreadCount: parseInt(result.rows[0].unread_count)
        });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unread count'
        });
    }
});

// Mark messages as read
router.put('/read/:senderId', authenticateToken, async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.user.userid;

        const query = `
            UPDATE messages
            SET read_at = NOW()
            WHERE senderid = $1 AND receiverid = $2 AND read_at IS NULL
        `;

        await pool.query(query, [senderId, receiverId]);
        
        res.json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark messages as read'
        });
    }
});

// Get user online status
router.get('/status/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // This would typically check against a Redis store or similar
        // For now, we'll return a basic response
        res.json({
            success: true,
            userId: userId,
            isOnline: false, // This would be determined by checking connected users
            lastSeen: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching user status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user status'
        });
    }
});

export default router; 