import { Request, Response, NextFunction } from 'express';
import { Comment, Media } from '../models';
import mongoose from 'mongoose';
import { createCommentNotification } from '../services/notificationService';

// Create a comment
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mediaId, text, type, parentCommentId } = req.body;
        const userId = (req as any).user._id;

        // Validate media exists
        const media = await Media.findById(mediaId);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        // If parent comment exists, validate it
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
            if (parentComment.mediaId.toString() !== mediaId) {
                return res.status(400).json({ message: 'Parent comment does not belong to this media' });
            }
        }

        // Create comment
        const comment = await Comment.create({
            mediaId,
            userId,
            text,
            type,
            parentCommentId,
        });

        // Increment comment count in media metrics
        await Media.findByIdAndUpdate(mediaId, {
            $inc: { 'metrics.comments': 1 },
        });

        // Create notification for media owner
        await createCommentNotification(mediaId, comment._id.toString(), userId.toString());

        // Populate user data
        const populatedComment = await Comment.findById(comment._id).populate('userId', 'name email profile.avatar');

        res.status(201).json(populatedComment);
    } catch (error) {
        next(error);
    }
};

// Get comments for a media item
export const getCommentsByMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mediaId } = req.params;
        const { type, sort = 'recent' } = req.query;

        // Build query
        const query: any = { mediaId, parentCommentId: null }; // Only top-level comments
        if (type && (type === 'critique' || type === 'hype')) {
            query.type = type;
        }

        // Build sort
        let sortCriteria: any = { createdAt: -1 }; // Default: recent first
        if (sort === 'oldest') {
            sortCriteria = { createdAt: 1 };
        }

        const comments = await Comment.find(query)
            .sort(sortCriteria)
            .populate('userId', 'name email profile.avatar')
            .limit(100); // Pagination can be added later

        res.json({ comments, total: comments.length });
    } catch (error) {
        next(error);
    }
};

// Update a comment
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = (req as any).user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only edit your own comments' });
        }

        comment.text = text;
        await comment.save();

        const populatedComment = await Comment.findById(comment._id).populate('userId', 'name email profile.avatar');
        res.json(populatedComment);
    } catch (error) {
        next(error);
    }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const userId = (req as any).user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }

        // Decrement comment count
        await Media.findByIdAndUpdate(comment.mediaId, {
            $inc: { 'metrics.comments': -1 },
        });

        await Comment.findByIdAndDelete(commentId);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
};
