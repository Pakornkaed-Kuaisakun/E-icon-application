import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js'; // Adjust the path as necessary
import dotenv from 'dotenv';

export async function userRegister(req, res) {
    try {
        const { username, emailAddress, password, confirmPassword } = req.body;

        // Validate input
        if (!username || !emailAddress || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            return res.status(400).json({ message: 'Please enter a valid email.' });
        }

        // Check password match confirm password
        if (password !== confirmPassword) {
            console.log(password, confirmPassword);
            return res.status(400).json({ message: 'Password do not match' });
        }

        // Check if user already exists
        const existingUser = await db`SELECT * FROM users WHERE email = ${emailAddress}`;
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a unique user ID base on timeStamp and tag e.g. 'user', 'test'
        // This is a simple example; consider using a more robust method in production
        const userID = `user_${Date.now()}_${randomBytes(4).toString('hex')}`;

        // Hash the password (consider using a library like bcrypt for better security)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const signup = await db`INSERT INTO users (userid, username, email, password) VALUES (${userID}, ${username}, ${emailAddress}, ${hashedPassword}) RETURNING *`;

        console.log(signup);
        res.status(201).json({ message: 'User registered successfully', user: signup[0] });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email.' });
        }

        // Fetch user from the database
        const user = await db`SELECT * FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(401).json({ message: 'Email or Password was wrong.' });
        }
        
        // Compare password (consider using bcrypt for better security)
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email or Password was wrong.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user[0].userid }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({ message: 'Login successful', token, user: user[0] });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}