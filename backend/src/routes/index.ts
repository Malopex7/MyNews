import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import mediaRoutes from './mediaRoutes';
import pollRoutes from './pollRoutes';
import commentRoutes from './commentRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/media', mediaRoutes);
router.use('/polls', pollRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);

export default router;

