import { Request, Response } from 'express';

export const getHelloWorld = (_req: Request, res: Response): void => {
    res.json({
        message: "Welcome to Full Stack Jokes API! 🎭",
        instructions: {
            step1: "Open the front end application",
            step2: "Click 'Seed Database' - this will make a POST request to seed the database",
            step3: "Jokes will automatically be fetched from the database",
            step4: "Click 'Make Me Laugh' to enjoy the jokes!"
        },
        apiEndpoints: {
            seedDatabase: "POST /database/seed",
            getAllJokes: "GET /jokes/all",
        },
        quickStart: "First time? Seed the database: curl -X POST http://localhost:3000/database/seed"
    });
};