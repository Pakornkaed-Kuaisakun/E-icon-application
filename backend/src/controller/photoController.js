import { db } from "../config/db.js";

export async function getProofTask(req, res) {
    const getFormattedDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    try {
        const getProofTask = await db`SELECT * FROM usertask WHERE date = ${getFormattedDate()} AND status = 'pending' AND userid != ${req.params.userid}`;
        if (getProofTask.length === 0) return res.status(404).json({ message: 'Task not found' });

        const taskID = getProofTask.map(row => row.taskid);

        const taskData = await db`SELECT * FROM tasks WHERE taskid = ANY(${taskID})`;

        const userID = getProofTask.map(userid => userid.userid);

        const userData = await db`SELECT * FROM users WHERE userid = ANY(${userID})`;

        return res.status(200).json({ taskData: taskData, proofTask: getProofTask, userData: userData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getImage(req, res) {
    try {
        const images = await db`
            SELECT * FROM usertask
            WHERE userid = ${req.params.userid} AND status = 'completed'
            ORDER BY date DESC
        `;

        if (images && images.length > 0) {
            return res.status(200).json({ images: images });
        } else {
            return res.status(404).json({ message: 'No images found for this user' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}