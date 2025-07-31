import { db } from "../config/db.js";

export async function globalRank(req, res) {
    try {
        const nameList = await db`SELECT * FROM users ORDER BY "treeLevel" DESC, "treePoint" DESC, created_at ASC LIMIT 20`;

        if(nameList.length === 0) {
            res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ global_rank: nameList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}