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

        if (dailyTaskData.length === 0)
            return res.status(404).json({ message: 'No Daily Task' });

        const today = getFormattedDate();

        // check insert task
        const haveDailyTask = await db`
        SELECT * FROM usertask 
        WHERE userid = ${userid} AND date = ${today}
        `;

        if (haveDailyTask.length === 0) {
            // ✅ Insert every task
            const insertTasks = [];

            for (const task of dailyTaskData) {
                const inserted = await db`
                INSERT INTO usertask (userid, taskid, date, status)
                VALUES (${userid}, ${task.taskid.trim()}, ${today}, 'unfinished')
                RETURNING *
                `;
                insertTasks.push(inserted[0]);
            }

            console.log('Add Daily Tasks:', insertTasks);
        }

        // Pull all today tasks
        const getDailyTask = await db`
        SELECT * FROM usertask 
        WHERE userid = ${userid} AND date = ${today}
        `;

        return res.status(200).json({ dailyTask: getDailyTask });

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
        if (getDailyTask.length === 0) return res.status(404).json({ message: 'Task not found' });

        const taskID = getDailyTask.map(row => row.taskid);

        const taskData = await db`SELECT * FROM tasks WHERE taskid = ANY(${taskID})`;


        return res.status(200).json({ taskData: taskData, dailyTask: getDailyTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateTaskStatus(req, res) {
    const { userid, taskid, imgPath, date, point, status } = req.body;
    try {
        const update = await db`UPDATE usertask SET "proofImageURL" = ${imgPath}, "status" = ${status} WHERE userid = ${userid} AND taskid = ${taskid} AND "date" = ${date}`;

        if (update) {
            const userData = await db`SELECT * FROM users WHERE userid = ${userid}`;

            // console.log(userData[0]);

            if (userData) {
                const updatePoint = await db`UPDATE users SET "growingPoint" = ${Number(Number(point) + Number(userData[0].growingPoint))} WHERE userid = ${userid}`;

                if (updatePoint) {
                    return res.status(200).json({ message: 'Update UserTask and Point successfully' });
                } else {
                    return res.status(500).json({ message: 'Update Point Failed' });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}