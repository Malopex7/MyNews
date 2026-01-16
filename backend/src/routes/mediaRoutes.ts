import { Router } from 'express';
import * as mediaController from '../controllers/mediaController';
import { authenticate } from '../middlewares';

const router = Router();

// ============================================
// Public Routes
// ============================================

// GET /api/media/feed - Get video feed (quality/recency)
router.get('/feed', mediaController.getFeed);

// GET /api/media/categories - Get predefined categories
router.get('/categories', mediaController.getCategories);

// GET /api/media/:id - Download/stream file (public for viewing)
router.get('/:id', mediaController.download);

// GET /api/media/:id/info - Get file metadata
router.get('/:id/info', mediaController.getInfo);

// ============================================
// Authenticated Routes
// ============================================

// POST /api/media/upload - Upload file
router.post('/upload', authenticate, mediaController.uploadMiddleware.single('file') as any, mediaController.upload);

// DELETE /api/media/:id - Delete file (owner or admin)
router.delete('/:id', authenticate, mediaController.remove);

// GET /api/media/user/:userId - Get user's media
router.get('/user/:userId', mediaController.getUserMedia);

export default router;
