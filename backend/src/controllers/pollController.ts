import { Request, Response, NextFunction } from 'express';
import { Poll, PollVote } from '../models';
import mongoose from 'mongoose';

// Create a poll for a trailer
export const createPoll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mediaId, templateType, question, options } = req.body;
        const creatorId = (req as any).user._id;

        // Validate that media exists and belongs to creator
        const Media = mongoose.model('Media');
        const media = await Media.findById(mediaId);

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        if (media.uploadedBy.toString() !== creatorId.toString()) {
            return res.status(403).json({ message: 'Only the creator can add a poll to this trailer' });
        }

        // Check if poll already exists for this media
        const existingPoll = await Poll.findOne({ mediaId });
        if (existingPoll) {
            return res.status(400).json({ message: 'A poll already exists for this trailer' });
        }

        // Create poll
        const poll = await Poll.create({
            mediaId,
            creatorId,
            templateType,
            question,
            options: options.map((text: string) => ({ text, votes: 0 })),
            totalVotes: 0,
        });

        res.status(201).json(poll);
    } catch (error) {
        next(error);
    }
};

// Get poll by media ID
export const getPollByMediaId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mediaId } = req.params;

        const poll = await Poll.findOne({ mediaId });

        if (!poll) {
            return res.status(404).json({ message: 'No poll found for this trailer' });
        }

        // If user is authenticated, check if they voted
        let userVote = null;
        if ((req as any).user) {
            const vote = await PollVote.findOne({ pollId: poll._id, userId: (req as any).user._id });
            if (vote) {
                userVote = vote.optionIndex;
            }
        }

        res.json({ poll, userVote });
    } catch (error) {
        next(error);
    }
};

// Vote on a poll
export const voteOnPoll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pollId } = req.params;
        const { optionIndex } = req.body;
        const userId = (req as any).user._id;

        // Find poll
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Validate option index
        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ message: 'Invalid option index' });
        }

        // Check if user already voted
        const existingVote = await PollVote.findOne({ pollId, userId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted on this poll' });
        }

        // Create vote record
        await PollVote.create({ pollId, userId, optionIndex });

        // Update poll vote count
        poll.options[optionIndex].votes += 1;
        poll.totalVotes += 1;
        await poll.save();

        res.json({ poll, userVote: optionIndex });
    } catch (error) {
        next(error);
    }
};

// Get poll results
export const getPollResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Calculate percentages
        const results = poll.options.map((option, index) => ({
            text: option.text,
            votes: option.votes,
            percentage: poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0,
        }));

        res.json({
            pollId: poll._id,
            question: poll.question,
            totalVotes: poll.totalVotes,
            results,
        });
    } catch (error) {
        next(error);
    }
};
