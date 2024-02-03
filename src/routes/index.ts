import express from 'express';
import authRoutes from './authRoutes';
import indexRoutes from './indexRoutes';

const router = express.Router();

// Mount authentication routes
router.use('/auth', authRoutes);
router.use('/', indexRoutes);

export default router;
