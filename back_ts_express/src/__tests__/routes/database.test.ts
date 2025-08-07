import request from 'supertest';
import app from '../../app';
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

describe('Database Route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockInitDB.mockResolvedValue(mockDb as any);
    });

    // SEED DATABASE
    describe('POST /database/seed', () => {
        it('should return 200 and seed the database successfully', async () => {
            // Mock successful axios response
            const mockJokes = [
                { type: 'general', setup: 'Why did the chicken cross the road?', punchline: 'To get to the other side!' },
                { type: 'dad', setup: 'Why did the coffee file a police report?', punchline: 'It got mugged!' }
            ];

            mockAxios.get.mockResolvedValue({ data: mockJokes });
            mockDb.run.mockResolvedValue(undefined);
            mockDb.get.mockResolvedValue({ count: 2 });

            const response = await request(app)
                .post('/database/seed')
                .expect(200);

            expect(response.body).toEqual({
                message: "Database seeded successfully",
                jokesInserted: 2,
                timestamp: expect.any(String)
            });

            expect(response.headers['content-type']).toMatch(/json/);
        });

        it('should call the correct API endpoint', async () => {
            const mockJokes = [{ type: 'general', setup: 'test', punchline: 'test' }];
            mockAxios.get.mockResolvedValue({ data: mockJokes });
            mockDb.run.mockResolvedValue(undefined);
            mockDb.get.mockResolvedValue({ count: 1 });

            await request(app)
                .post('/database/seed')
                .expect(200);

            expect(mockAxios.get).toHaveBeenCalledWith(
                'https://raw.githubusercontent.com/15Dkatz/official_joke_api/master/jokes/index.json'
            );
        });
    });

    describe('POST /database/nonexistent', () => {
        it('should return 404 for non-existent route', async () => {
            const response = await request(app)
                .post('/database/nonexistent')
                .expect(404);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('status', 404);
        });
    });
});