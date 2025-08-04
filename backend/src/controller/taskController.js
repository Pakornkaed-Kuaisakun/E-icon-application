import { db } from "../config/db.js";

export async function getTask(req, res) {
    const { userid } = req.body;

    const getFormattedDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    try {
        const dailyTaskData = await db`SELECT * FROM tasks WHERE tasktype = 'daily'`;

        if(dailyTaskData.length === 0) return res.status(404).json({ message: 'No Daily Task' });

        const haveDailyTask = await db`SELECT * FROM usertask WHERE userid = ${userid} AND date = ${getFormattedDate()}`;

        if(haveDailyTask.length === 0) {
            const insertDailyTask = await db`INSERT INTO usertask (userid, taskid, date, status) VALUES (${userid}, ${dailyTaskData[0].taskid}, ${getFormattedDate()}, 'unfinished') RETURNING *`;

            console.log('Add Daily Task\n', insertDailyTask);
        }

        // const getDailyTask = await db`SELECT * FROM usertask WHERE userid = ${req.params.userid} AND date = ${getFormattedDate()}`;

        return res.status(200).json({ dailyTask: getDailyTask });
        // return res.status(200).json({ message: 'Check for Daily Task Complete' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getDailyTask(req, res) {
    const getFormattedDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    try {
        const getDailyTask = await db`SELECT * FROM usertask WHERE userid = ${req.params.userid} AND date = ${getFormattedDate()}`;
        if(getDailyTask.length === 0) return res.status(404).json({ message: 'Task not found' });

        const taskID = getDailyTask.map(row => row.taskid);

        const taskData = await db`SELECT * FROM tasks WHERE taskid = ANY(${taskID})`;


        return res.status(200).json({ taskData: taskData, dailyTask: getDailyTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateTaskStatus(req, res) {
    const { userid, taskid, imgPath } = req.body;
    try {
        const update = await db`UPDATE usertask SET "proofImageURL" = ${imgPath}, "status" = 'pending' WHERE userid = ${userid} AND taskid = ${taskid}`;

        if(update) {
            return res.status(200).json({ message: 'Update Task Status - pending - Successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}