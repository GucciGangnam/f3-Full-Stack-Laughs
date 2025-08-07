import { Request, Response, NextFunction } from 'express';
import { initDB } from '../database';

// Get all jokes
export const getAllJokes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('Getting all jokes...')

        // Initialize database
        const db = await initDB();

        // Get all jokes from database
        const jokes = await db.all('SELECT id, type, setup, punchline FROM jokes ORDER BY id');

        // Get category counts for the pie chart
        const categories = await db.all(`
      SELECT type as category, COUNT(*) as count 
      FROM jokes 
      GROUP BY type 
      ORDER BY count DESC
    `);

        await db.close();

        // Check if database is empty
        if (jokes.length === 0) {
            res.json({
                message: "No jokes found in database. Please seed the database first.",
                count: 0,
                jokes: [],
                categories: []
            });
            console.log('❌ Database is empty')
        } else {
            res.json({
                message: "All jokes retrieved successfully",
                count: jokes.length,
                jokes: jokes,
                totalCategories: categories.length,
                categories: categories
            });
            console.log('✅ jokes fetched')
            console.log('✅ ', jokes.length, 'jokes')
            console.log('✅ ', categories.length, 'categories')
        }



    } catch (error) {
        console.error('❌ Error retrieving jokes:', error);
        next(error);
    }
};