import request from 'supertest';
import app from '../../app';
import { initDB } from '../../database';

// Mock the database
jest.mock('../../database');

const mockInitDB = initDB as jest.MockedFunction<typeof initDB>;

// Mock database methods
const mockDb = {
    all: jest.fn(),
    close: jest.fn()
};

// GET ALL JOKES
describe('Jokes Route - getAllJokes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockInitDB.mockResolvedValue(mockDb as any);
    });

    describe('GET /jokes/all', () => {
        it('should return 200 and retrieve all jokes from database', async () => {
            // Mock database response for jokes
            const mockJokesFromDb = [
                { id: 1, type: 'general', setup: 'Why did the chicken cross the road?', punchline: 'To get to the other side!' },
                { id: 2, type: 'dad', setup: 'Why did the coffee file a police report?', punchline: 'It got mugged!' }
            ];

            // Mock database response for categories
            const mockCategories = [
                { category: 'general', count: 1 },
                { category: 'dad', count: 1 }
            ];

            mockDb.all
                .mockResolvedValueOnce(mockJokesFromDb)
                .mockResolvedValueOnce(mockCategories);

            const response = await request(app)
                .get('/jokes/all')
                .expect(200);

            expect(response.body).toEqual({
                message: "All jokes retrieved successfully",
                count: 2,
                jokes: mockJokesFromDb,
                totalCategories: 2,
                categories: mockCategories
            });

            expect(response.headers['content-type']).toMatch(/json/);
        });

        it('should return helpful message when no jokes in database', async () => {
            mockDb.all
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([]);

            const response = await request(app)
                .get('/jokes/all')
                .expect(200);

            expect(response.body).toEqual({
                message: "No jokes found in database. Please seed the database first.",
                count: 0,
                jokes: [],
                categories: []
            });
        });
    });
});