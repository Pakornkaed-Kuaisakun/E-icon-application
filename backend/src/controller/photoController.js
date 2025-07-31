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

export async function ConfirmImage(req, res) {
    const { userid, taskid, point, id, currentPoint } = req.body;

    try {
        const updateUserTask = await db`UPDATE usertask SET status = 'completed' WHERE userid = ${userid} AND taskid = ${taskid} AND id = ${id}`;

        if(updateUserTask) {
            const updatePoint = await db`UPDATE users SET "growingPoint" = ${Number(Number(point) + Number(currentPoint))} WHERE userid = ${userid}`;

            if(updatePoint) {
                return res.status(200).json({ message: 'Update UserTask and Point successfully' });
            } else {
                return res.status(500).json({ message: 'Update Point Failed' });
            }
        } else {
            return res.status(500).json({ message: 'Update UserTask Failed' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function RejectImage(req, res) {
    const { userid, taskid, id } = req.body;

    try {
        const deleteUserTask = await db`DELETE FROM usertask WHERE userid = ${userid} AND taskid = ${taskid} AND id = ${id}`;

        // console.log(deleteUserTask);
        
        if(deleteUserTask) {
            console.log(deleteUserTask);
            return res.status(200).json({ message: 'Delete Row successfully' });
        } else {
            return res.status(500).json({ message: 'Delete Row Failed' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}