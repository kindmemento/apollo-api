import express from 'express';
import authRoutes from './authRoutes';

const router = express.Router();

// Mount authentication routes
router.use('/auth', authRoutes);

export default router;
