import express from 'express';
import { userRegister, userLogin } from '../controller/authController.js'; // Adjust the path as necessary

const router = express.Router();

router.post('/signup', userRegister);

router.post('/signin', userLogin);

router.get('/users/:id', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await db`SELECT * FROM users WHERE id = ${req.params.id} ORDER BY created_at DESC`;
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;