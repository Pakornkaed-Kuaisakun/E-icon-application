import { db } from "../config/db.js";

export async function AddFriend(req, res) {
    const { senderID, receiverEmail } = req.body;

    try {
        const receiver = await db`SELECT userid FROM users WHERE email = ${receiverEmail} LIMIT 1`;
        if (receiver.length === 0) return res.status(404).json({ message: "User not found" });

        // console.log('SenderID: ', senderID);
        // console.log('ReceiverID', receiver[0].userid);

        const receiverID = receiver[0].userid;

        const existingFriend = await db`
        SELECT * FROM friends 
        WHERE 
            (userid = ${senderID} AND friendid = ${receiverID}) 
            OR 
            (userid = ${receiverID} AND friendid = ${senderID})`;

        console.log(existingFriend);

        const existingRequest = await db`
        SELECT * FROM friendrequest 
        WHERE 
            (senderid = ${senderID} AND receiverid = ${receiverID}) 
            OR 
            (senderid = ${receiverID} AND receiverid = ${senderID}) 
            AND status = 'pending'`;

        console.log(existingRequest);

        if (existingFriend.length > 0) {
            return res.status(400).json({ message: "Already friends." });
        }

        if (existingRequest.length > 0) {
            return res.status(400).json({ message: "Friend request already pending." });
        }

        // insert friend request
        const friendRequest = await db`
        INSERT INTO friendrequest (senderid, receiverid, status) 
        VALUES (${senderID}, ${receiverID}, 'pending') 
        RETURNING *`;


        console.log(friendRequest[0]);

        res.status(200).json({ message: "Friends added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function searchUser(req, res) {
    try {
        const result = await db`SELECT * FROM users WHERE LOWER(email) = LOWER(${decodeURIComponent(req.params.email)}) ORDER BY created_at DESC LIMIT 1`;
        if (result.length > 0) {
            res.status(200).json({ user: result[0] });
        } else {
            res.status(404).json({ user: null });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getFriendRequestStatus(req, res) {
    try {
        const requestRowStatus = await db`SELECT status FROM friendrequest WHERE (senderid = ${req.query.senderID} AND receiverid = ${req.query.receiverID}) OR (senderid = ${req.query.receiverID} AND receiverid = ${req.query.senderID})`

        if (requestRowStatus.length > 0) {
            return res.status(200).json({ status: requestRowStatus[0].status });
        }

        res.status(200).json({ status: 'add' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getFriendRequest(req, res) {
    try {
        const requestRows = await db`
            SELECT * FROM friendrequest 
            WHERE receiverid = ${req.params.senderID} AND status = 'pending'
            ORDER BY request_time DESC
        `;

        if (requestRows.length === 0) {
            return res.status(404).json({ userRequests: [] });
        }

        const senderIds = requestRows.map(row => row.senderid);

        const users = await db`
            SELECT * FROM users 
            WHERE userid = ANY(${senderIds})
            ORDER BY created_at DESC
        `;

        res.status(200).json({ user: users }); // เปลี่ยน key เป็น users (plural)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export async function requestAccept(req, res) {
    try {
        const { receiverID, requesterID } = req.body;

        const dateNow = new Date()
        const timestamp = dateNow.toISOString();

        const updateStatus = await db`UPDATE friendrequest SET status = 'accept', respond_time = ${timestamp} WHERE receiverid = ${receiverID} AND senderid = ${requesterID}`;

        const insertFriend = await db`INSERT INTO friends (userid, friendid) VALUES (${requesterID}, ${receiverID})`;

        if (updateStatus && insertFriend) {
            res.status(200).json({ message: 'Add Friend Successful' });
        } else {
            res.status(500).json({ message: 'error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function requestReject(req, res) {
    try {
        const { receiverID, requesterID } = req.body;

        const dateNow = new Date()
        const timestamp = dateNow.toISOString();

        const updateStatus = await db`UPDATE friendrequest SET status = 'add', respond_time = ${timestamp} WHERE receiverid = ${receiverID} AND senderid = ${requesterID}`;

        if (updateStatus) {
            res.status(200).json({ message: 'Reject Friend Successful' });
        } else {
            res.status(500).json({ message: 'error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getFriendData(req, res) {
    try {
        const friendList = await db`SELECT * FROM friends WHERE userid = ${req.params.userid} OR friendid = ${req.params.userid}`

        if (friendList.length === 0) {
            return res.status(404).json({ friendList: [] });
        }

        const userID = friendList.map(row => row.userid !== req.params.userid ? row.userid : row.friendid);

        const users = await db`
            SELECT * FROM users 
            WHERE userid = ANY(${userID})
            ORDER BY created_at DESC
        `;

        res.status(200).json({ user: users }); // เปลี่ยน key เป็น users (plural)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}