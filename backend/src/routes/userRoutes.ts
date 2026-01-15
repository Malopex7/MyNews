import { Router } from 'express';
import { userController } from '../controllers';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users/me - Get current user
router.get('/me', userController.getMe);

// GET /api/users - Get all users (admin only)
router.get('/', authorize('admin'), userController.getAll);

// GET /api/users/:id - Get user by ID (admin only)
router.get('/:id', authorize('admin'), userController.getById);

// PATCH /api/users/:id - Update user
router.patch('/:id', userController.update);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authorize('admin'), userController.remove);

export default router;
