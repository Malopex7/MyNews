import { Router } from 'express';
import { userController } from '../controllers';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// ============================================
// Public Routes (no authentication required)
// ============================================

// GET /api/users/:username/profile - Get public profile by username
router.get('/:username/profile', userController.getPublicProfile);

// ============================================
// Authenticated Routes
// ============================================

// GET /api/users/me - Get current user
router.get('/me', authenticate, userController.getMe);

// PATCH /api/users/:id - Update user (self or admin)
router.patch('/:id', authenticate, userController.update);

// ============================================
// Follow Routes (authenticated)
// ============================================

// POST /api/users/:id/follow - Follow a user
router.post('/:id/follow', authenticate, userController.followUser);

// DELETE /api/users/:id/follow - Unfollow a user
router.delete('/:id/follow', authenticate, userController.unfollowUser);

// GET /api/users/:id/follow - Check if following a user
router.get('/:id/follow', authenticate, userController.checkFollowing);

// GET /api/users/:id/followers - Get user's followers
router.get('/:id/followers', userController.getFollowers);

// GET /api/users/:id/following - Get who user is following
router.get('/:id/following', userController.getFollowing);

// ============================================
// Admin Routes
// ============================================

// GET /api/users - Get all users (admin only)
router.get('/', authenticate, authorize('admin'), userController.getAll);

// GET /api/users/:id - Get user by ID (admin only)
router.get('/:id', authenticate, authorize('admin'), userController.getById);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticate, authorize('admin'), userController.remove);

export default router;
