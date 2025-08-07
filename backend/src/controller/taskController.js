import { db } from "../config/db.js";

export async function getTask(req, res) {
    const { userid, date } = req.body;

    try {
        const dailyTaskData = await db`SELECT * FROM tasks WHERE tasktype = 'daily'`;

        if (dailyTaskData.length === 0)
            return res.status(404).json({ message: 'No Daily Task' });

        // check insert task
        const haveDailyTask = await db`
        SELECT * FROM usertask 
        WHERE userid = ${userid} AND date = ${date}
        `;

        if (haveDailyTask.length === 0) {
            // ✅ Insert every task
            const insertTasks = [];

            for (const task of dailyTaskData) {
                const inserted = await db`
                INSERT INTO usertask (userid, taskid, date, status)
                VALUES (${userid}, ${task.taskid.trim()}, ${date}, 'unfinished')
                RETURNING *
                `;
                insertTasks.push(inserted[0]);
            }

            console.log('Add Daily Tasks:', insertTasks);
        }

        // Pull all today tasks
        const getDailyTask = await db`
        SELECT * FROM usertask 
        WHERE userid = ${userid} AND date = ${date}
        `;

        return res.status(200).json({ dailyTask: getDailyTask });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getDailyTask(req, res) {
    try {
        const getDailyTask = await db`SELECT * FROM usertask WHERE userid = ${req.query.userid} AND date = ${req.query.date}`;
        if (getDailyTask.length === 0) return res.status(404).json({ message: 'Task not found' });

        const taskID = getDailyTask.map(row => row.taskid);

        const taskData = await db`SELECT * FROM tasks WHERE taskid = ANY(${taskID})`;


        return res.status(200).json({ taskData: taskData, dailyTask: getDailyTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function fetchEventTask(req, res) {
    try {
        const eventTask = await db`SELECT * FROM tasks WHERE tasktype = 'event'`;

        // console.log(eventTask);

        if(eventTask) {
            return res.status(200).json({ event: eventTask });
        } else {
            return res.status(404).json({ message: 'Event Task not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export async function fetchEventTaskUser(req, res) {
    try {
        const userID = req.query.userID;
        const rawTaskIDs = req.query.taskIDs;
        const taskIDs = Array.isArray(rawTaskIDs) ? rawTaskIDs : rawTaskIDs?.split(',') || [];

        console.log(userID, taskIDs);
        console.log(db(taskIDs));

        if (!userID || !taskIDs || taskIDs.length === 0) {
            return res.status(400).json({ message: 'Missing userID or taskIDs' });
        }

        const eventTaskUser = await db`SELECT * FROM usertask WHERE userid = ${userID} AND taskid = ANY(${taskIDs})`;

        console.log(eventTaskUser);

        return res.status(200).json({ eventTaskUser: eventTaskUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error });
    }
}


export async function createEventTask(req, res) {
    const { userid, taskid, date } = req.body;
    try {
        const create = await db`INSERT INTO usertask (userid, taskid, date, status) VALUES (${userid}, ${taskid}, ${date}, 'unfinished') RETURNING *`;

        console.log(create);
        if(create) {
            return res.status(200).json({ message: 'Create Event Task Successfully' });
        } else {
            return res.status(500).json({ message: 'Create Event Task Failed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export async function updateTaskStatus(req, res) {
    const { userid, taskid, imgPath, date } = req.body;
    try {
        const update = await db`UPDATE usertask SET "proofImageURL" = ${imgPath}, "status" = ${'pending'} WHERE userid = ${userid} AND taskid = ${taskid} AND "date" = ${date} RETURNING *`;
        // const update = await db`
        //     UPDATE usertask 
        //     SET "proofImageURL" = ${imgPath}, "status" = ${status || 'completed'} 
        //     WHERE userid = ${userid} AND taskid = ${taskid} AND date = ${date}
        //     RETURNING *`;

        // if (update.length === 0) {
        //     return res.status(200).json({ message: 'No matching usertask to update' });
        // }

        // const userData = await db`SELECT * FROM users WHERE userid = ${userid}`;
        // if (userData.length === 0) {
        //     return res.status(200).json({ message: 'User not found' });
        // }

        // const updatePoint = await db`
        //     UPDATE users 
        //     SET "growingPoint" = ${Number(Number(point) + Number(userData[0].growingPoint))} 
        //     WHERE userid = ${userid} RETURNING *`;

        // if (updatePoint) {
        //     return res.status(200).json({ message: 'Update UserTask and Point successfully' });
        // } else {
        //     return res.status(500).json({ message: 'Update Point Failed' });
        // }

        if(update) {
            return res.status(200).json({ message: 'Update Task Status - pending - Successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
