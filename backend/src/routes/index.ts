import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import mediaRoutes from './mediaRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/media', mediaRoutes);

export default router;

