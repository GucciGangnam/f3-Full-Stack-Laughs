import express from 'express';
import { getAllJokes } from '../controllers/jokesController';

const router = express.Router();


// GET all jokes
router.get('/all', getAllJokes);

export default router;