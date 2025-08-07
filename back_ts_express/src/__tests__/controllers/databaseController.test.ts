import { Request, Response, NextFunction } from 'express';
import { seedDatabase } from '../../controllers/databaseController';
import axios from 'axios';
import { initDB } from '../../database';

// Mock the external dependencies
jest.mock('axios');
jest.mock('../../database');

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockInitDB = initDB as jest.MockedFunction<typeof initDB>;

// Mock database methods
const mockDb = {
    run: jest.fn(),
    get: jest.fn(),
    close: jest.fn()
};

// Mock the Response object
const mockResponse = () => {
    const res: Partial<Response> = {};
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Mock the Request object
const mockRequest = () => {
    const req: Partial<Request> = {};
    return req as Request;
};

// Mock the NextFunction
const mockNext = jest.fn() as NextFunction;

describe('DatabaseController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockInitDB.mockResolvedValue(mockDb as any);
    });

    describe('seedDatabase', () => {
        it('should successfully seed the database with jokes', async () => {
            const req = mockRequest();
            const res = mockResponse();

            // Mock successful axios response
            const mockJokes = [
                { type: 'general', setup: 'Why did the chicken cross the road?', punchline: 'To get to the other side!' },
                { type: 'programming', setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs!' }
            ];

            mockAxios.get.mockResolvedValue({ data: mockJokes });

            // Mock database operations
            mockDb.run.mockResolvedValue(undefined);
            mockDb.get.mockResolvedValue({ count: 2 });

            await seedDatabase(req, res, mockNext);

            // Verify API was called with correct URL
            expect(mockAxios.get).toHaveBeenCalledWith(
                'https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json'
            );

            // Verify database was initialized
            expect(mockInitDB).toHaveBeenCalledTimes(1);

            // Verify existing jokes were cleared
            expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM jokes');

            // Verify jokes were inserted correctly
            expect(mockDb.run).toHaveBeenCalledWith(
                'INSERT INTO jokes (type, setup, punchline) VALUES (?, ?, ?)',
                ['general', 'Why did the chicken cross the road?', 'To get to the other side!']
            );
            expect(mockDb.run).toHaveBeenCalledWith(
                'INSERT INTO jokes (type, setup, punchline) VALUES (?, ?, ?)',
                ['programming', 'Why do programmers prefer dark mode?', 'Because light attracts bugs!']
            );

            // Verify count was retrieved
            expect(mockDb.get).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM jokes');

            // Verify database connection was closed
            expect(mockDb.close).toHaveBeenCalledTimes(1);

            // Verify successful response
            expect(res.json).toHaveBeenCalledWith({
                message: "Database seeded successfully",
                jokesInserted: 2,
                timestamp: expect.any(String)
            });

            // Verify no errors were passed to next()
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});