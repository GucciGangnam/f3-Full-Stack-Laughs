import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { initDB } from '../database';

interface Joke {
    id?: number;
    type: string;
    setup: string;
    punchline: string;
}

export const seedDatabase = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('Seeding Database...')

        // Initialize database
        const db = await initDB();

        // Clear existing jokes
        await db.run('DELETE FROM jokes');

        // Fetch jokes from GitHub using axios
        const response = await axios.get('https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json');
        const jokes: Joke[] = response.data;

        // Insert jokes into database
        for (const joke of jokes) {
            await db.run(
                'INSERT INTO jokes (type, setup, punchline) VALUES (?, ?, ?)',
                [joke.type, joke.setup, joke.punchline]
            );
        }

        // Get count of inserted jokes
        const result = await db.get('SELECT COUNT(*) as count FROM jokes');
        await db.close();

        res.json({
            message: "Database seeded successfully",
            jokesInserted: result.count,
            timestamp: new Date().toISOString()
        });

        console.log('✅ Database seeded successfully')

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        next(error);
    }
};