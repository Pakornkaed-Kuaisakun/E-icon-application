import {neon} from '@neondatabase/serverless';
import { Pool } from 'pg';
import 'dotenv/config';

// Create Database connection
export const db = neon(process.env.DATABASE_URL);

// export const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// });

export async function initDB() {
    try {
        await db`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            userID VARCHAR(50) NOT NULL UNIQUE,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1); // Exit the process if database initialization fails (1 = error code, 0 = success)
    }
}