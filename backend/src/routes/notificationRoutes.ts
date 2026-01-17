import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticate } from '../middlewares';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// GET /api/notifications - Get user's notifications (paginated)
// Query params: page, limit, unreadOnly=true
router.get('/', notificationController.getNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', notificationController.deleteNotification);

export default router;
