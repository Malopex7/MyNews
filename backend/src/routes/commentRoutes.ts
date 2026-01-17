import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
    createComment,
    getCommentsByMedia,
    updateComment,
    deleteComment,
} from '../controllers/commentController';

const router = express.Router();

// Create comment (authenticated)
router.post('/', authenticate, createComment);

// Get comments by media ID (public, but supports query params for type and sort)
router.get('/media/:mediaId', getCommentsByMedia);

// Update comment (authenticated, must be owner)
router.patch('/:commentId', authenticate, updateComment);

// Delete comment (authenticated, must be owner)
router.delete('/:commentId', authenticate, deleteComment);

export default router;
