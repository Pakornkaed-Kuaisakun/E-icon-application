import { db } from '../config/db.js'; // Adjust the path as necessary
import bcrypt from 'bcrypt';

export async function getDashboardData(req, res) {
    try {
        // Fetch data to display on the dashboard
        const dashboardData = await db`
            SELECT *
            FROM users 
            WHERE userid = ${req.params.userid} 
            ORDER BY created_at DESC
        `;

        if (dashboardData.length === 0) {
            return res.status(404).json({ message: 'Dashboard data not found' });
        }

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function useGrowTree(req, res) {
    const { userid, currentTreeLevel, currentTreePoint, currentGrowingPoint } = req.body;
    try {
        if (Number(currentTreePoint) < 99) {
            const growTree = await db`UPDATE users SET "treePoint" = ${Number(currentTreePoint + 1)}, "growingPoint" = ${Number(currentGrowingPoint - 1)} WHERE userid = ${userid}`;

            if (growTree) {
                res.status(200).json({ message: 'Grow Tree Successfully', reward: false });
            } else {
                res.status(500).json({ message: 'error - treePoint < 99' });
            }
        } else {
            const growTree = await db`UPDATE users SET "treeLevel" = ${Number(currentTreeLevel) + 1}, "treePoint" = 0, "growingPoint" = ${Number(currentGrowingPoint) - 1} WHERE userid = ${userid}`;
            if (growTree) {
                res.status(200).json({ message: 'Grow Tree Successfully', reward: true });
            } else {
                res.status(500).json({ message: 'error - treePoint < 99' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function changePassword(req, res) {
    const { userid, currentPassword, newPassword } = req.body;

    if (!userid || !currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    try {
        const result = await db`SELECT password FROM users WHERE userid = ${userid}`;

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(200).json({ success: false, message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const update = await db`UPDATE users SET password = ${hashedNewPassword} WHERE userid = ${userid}`;

        if(update) {
            return res.status(200).json({ success: true, message: 'Password updated successfully.' });
        } else {
            return res.status(200).json({ success: false, message: 'Update Failed' });
        }
    } catch (err) {
        console.error('Error changing password:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}