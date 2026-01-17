import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
    createPoll,
    getPollByMediaId,
    voteOnPoll,
    getPollResults,
} from '../controllers/pollController';

const router = express.Router();

// Create poll (authenticated, creator only - validation in controller)
router.post('/', authenticate, createPoll);

// Get poll by media ID (public, but returns userVote if authenticated)
router.get('/media/:mediaId', getPollByMediaId);

// Vote on poll (authenticated)
router.post('/:pollId/vote', authenticate, voteOnPoll);

// Get poll results (public)
router.get('/:pollId/results', getPollResults);

export default router;
