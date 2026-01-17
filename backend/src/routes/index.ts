import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import mediaRoutes from './mediaRoutes';
import pollRoutes from './pollRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/media', mediaRoutes);
router.use('/polls', pollRoutes);

export default router;

