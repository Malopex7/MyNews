import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models';

/**
 * Get user's notifications
 * GET /api/notifications
 */
export const getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const unreadOnly = req.query.unreadOnly === 'true';
        const skip = (page - 1) * limit;

        // Build query
        const query: any = { recipient: userId };
        if (unreadOnly) {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .populate('actor', 'username name')
            .populate('targetMedia', 'title filename')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Notification.countDocuments(query);

        res.json({
            items: notifications.map((notif: any) => ({
                id: notif._id,
                type: notif.type,
                actor: {
                    id: notif.actor._id,
                    username: notif.actor.username,
                    name: notif.actor.name,
                },
                targetMedia: {
                    id: notif.targetMedia._id,
                    title: notif.targetMedia.title,
                    filename: notif.targetMedia.filename,
                },
                targetComment: notif.targetComment,
                read: notif.read,
                createdAt: notif.createdAt,
            })),
            page,
            limit,
            total,
            unreadCount: unreadOnly ? total : await Notification.countDocuments({ recipient: userId, read: false }),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
export const markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        res.json({ success: true, notification });
    } catch (error) {
        next(error);
    }
};

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;

        const result = await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        res.json({ success: true, modified: result.modifiedCount });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            recipient: userId,
        });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
};
