import { db } from "../config/db.js";

export async function getAppInfo(req, res) {
    try {
        const appInfo = await db`SELECT * FROM appinfo`;

        if (appInfo) {
            return res.status(200).json({ appInfo: appInfo[0] });
        } else {
            return res.status(404).json({ message: 'App Info not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}