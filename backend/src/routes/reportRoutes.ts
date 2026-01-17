import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares';

const router = Router();

// ============================================
// Authenticated Routes
// ============================================

// POST /api/reports - Submit a new report
router.post('/', authenticate, reportController.createReport);

// ============================================
// Admin Routes
// ============================================

// GET /api/reports - Get all reports
router.get('/', authenticate, authorize('admin'), reportController.getReports);

// GET /api/reports/:id - Get specific report
router.get('/:id', authenticate, authorize('admin'), reportController.getReport);

// PATCH /api/reports/:id - Update report status
router.patch('/:id', authenticate, authorize('admin'), reportController.updateReport);

export default router;
