import express from 'express';
import { seedDatabase } from '../controllers/databaseController';

const router = express.Router();

// POST seed database
router.post('/seed', seedDatabase);

export default router;