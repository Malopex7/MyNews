import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// ============================================
// Admin Routes - All require admin role
// ============================================

// GET /api/admin/stats - Get platform-wide statistics
router.get('/stats', authenticate, authorize('admin'), adminController.getStats);

// GET /api/admin/analytics/users - Get user growth data for charts
router.get('/analytics/users', authenticate, authorize('admin'), adminController.getUserAnalytics);

// GET /api/admin/analytics/content - Get content creation trends
router.get('/analytics/content', authenticate, authorize('admin'), adminController.getContentAnalytics);

// GET /api/admin/analytics/reports - Get report volume data
router.get('/analytics/reports', authenticate, authorize('admin'), adminController.getReportAnalytics);

export default router;
