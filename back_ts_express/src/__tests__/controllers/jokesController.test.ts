import { Request, Response, NextFunction } from 'express';
import { getAllJokes } from '../../controllers/jokesController';
import { initDB } from '../../database';

// Mock the database
jest.mock('../../database');

const mockInitDB = initDB as jest.MockedFunction<typeof initDB>;

// Mock database methods
const mockDb = {
    all: jest.fn(),
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

describe('JokesController - getAllJokes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockInitDB.mockResolvedValue(mockDb as any);
    });

    describe('getAllJokes', () => {
        it('should retrieve all jokes from database successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();

            // Mock database response for jokes
            const mockJokesFromDb = [
                { id: 1, type: 'general', setup: 'Why did the chicken cross the road?', punchline: 'To get to the other side!' },
                { id: 2, type: 'programming', setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs!' },
                { id: 3, type: 'dad', setup: 'Why did the coffee file a police report?', punchline: 'It got mugged!' }
            ];

            // Mock database response for categories
            const mockCategories = [
                { category: 'general', count: 1 },
                { category: 'programming', count: 1 },
                { category: 'dad', count: 1 }
            ];

            mockDb.all
                .mockResolvedValueOnce(mockJokesFromDb) // First call for jokes
                .mockResolvedValueOnce(mockCategories); // Second call for categories

            await getAllJokes(req, res, mockNext);

            // Verify database was initialized
            expect(mockInitDB).toHaveBeenCalledTimes(1);

            // Verify correct SQL queries were executed
            expect(mockDb.all).toHaveBeenCalledWith('SELECT id, type, setup, punchline FROM jokes ORDER BY id');
            expect(mockDb.all).toHaveBeenCalledWith(`
      SELECT type as category, COUNT(*) as count 
      FROM jokes 
      GROUP BY type 
      ORDER BY count DESC
    `);

            // Verify database connection was closed
            expect(mockDb.close).toHaveBeenCalledTimes(1);

            // Verify successful response
            expect(res.json).toHaveBeenCalledWith({
                message: "All jokes retrieved successfully",
                count: 3,
                jokes: mockJokesFromDb,
                totalCategories: 3,
                categories: mockCategories
            });

            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should handle empty database correctly', async () => {
            const req = mockRequest();
            const res = mockResponse();

            // Mock empty database response
            mockDb.all
                .mockResolvedValueOnce([]) // First call for jokes
                .mockResolvedValueOnce([]); // Second call for categories

            await getAllJokes(req, res, mockNext);

            // Verify helpful response for empty database
            expect(res.json).toHaveBeenCalledWith({
                message: "No jokes found in database. Please seed the database first.",
                count: 0,
                jokes: [],
                categories: []
            });

            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});