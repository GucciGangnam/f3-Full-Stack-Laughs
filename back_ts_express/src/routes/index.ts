import express from 'express';
import { getHelloWorld } from '../controllers/indexController';

const router = express.Router();

// GET homepage
router.get('/', getHelloWorld);

export default router;