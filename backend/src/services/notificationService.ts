import mongoose from 'mongoose';
import { Notification, Media } from '../models';

/**
 * Create a notification for a like action
 */
export const createLikeNotification = async (
    mediaId: string,
    actorId: string
): Promise<void> => {
    try {
        // Get media to find owner
        const media = await Media.findById(mediaId);
        if (!media) return;

        // Don't notify if user likes their own content
        if (media.uploadedBy.toString() === actorId) return;

        // Check if notification already exists (prevent duplicates)
        const existing = await Notification.findOne({
            recipient: media.uploadedBy,
            actor: new mongoose.Types.ObjectId(actorId),
            type: 'like',
            targetMedia: new mongoose.Types.ObjectId(mediaId),
        });

        if (!existing) {
            await Notification.create({
                recipient: media.uploadedBy,
                actor: new mongoose.Types.ObjectId(actorId),
                type: 'like',
                targetMedia: new mongoose.Types.ObjectId(mediaId),
                read: false,
            });
        }
    } catch (error) {
        console.error('Error creating like notification:', error);
    }
};

/**
 * Remove notification when a like is removed
 */
export const removeLikeNotification = async (
    mediaId: string,
    actorId: string
): Promise<void> => {
    try {
        await Notification.deleteOne({
            actor: new mongoose.Types.ObjectId(actorId),
            type: 'like',
            targetMedia: new mongoose.Types.ObjectId(mediaId),
        });
    } catch (error) {
        console.error('Error removing like notification:', error);
    }
};

/**
 * Create a notification for a comment
 */
export const createCommentNotification = async (
    mediaId: string,
    commentId: string,
    actorId: string
): Promise<void> => {
    try {
        // Get media to find owner
        const media = await Media.findById(mediaId);
        if (!media) return;

        // Don't notify if user comments on their own content
        if (media.uploadedBy.toString() === actorId) return;

        await Notification.create({
            recipient: media.uploadedBy,
            actor: new mongoose.Types.ObjectId(actorId),
            type: 'comment',
            targetMedia: new mongoose.Types.ObjectId(mediaId),
            targetComment: new mongoose.Types.ObjectId(commentId),
            read: false,
        });
    } catch (error) {
        console.error('Error creating comment notification:', error);
    }
};

/**
 * Create a notification for a response trailer
 */
export const createResponseNotification = async (
    originalMediaId: string,
    responseMediaId: string,
    actorId: string
): Promise<void> => {
    try {
        // Get original media to find owner
        const originalMedia = await Media.findById(originalMediaId);
        if (!originalMedia) return;

        // Don't notify if user responds to their own content
        if (originalMedia.uploadedBy.toString() === actorId) return;

        await Notification.create({
            recipient: originalMedia.uploadedBy,
            actor: new mongoose.Types.ObjectId(actorId),
            type: 'response',
            targetMedia: new mongoose.Types.ObjectId(responseMediaId),
            read: false,
        });
    } catch (error) {
        console.error('Error creating response notification:', error);
    }
};
