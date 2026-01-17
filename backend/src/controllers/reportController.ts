import { Request, Response, NextFunction } from 'express';
import { Report } from '../models';
import mongoose from 'mongoose';

/**
 * Submit a new content report
 * POST /api/reports
 */
export const createReport = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { contentType, contentId, reason, details } = req.body;

        // Validate required fields
        if (!contentType || !contentId || !reason) {
            res.status(400).json({ message: 'contentType, contentId, and reason are required' });
            return;
        }

        // Validate contentType
        if (!['trailer', 'comment'].includes(contentType)) {
            res.status(400).json({ message: 'contentType must be "trailer" or "comment"' });
            return;
        }

        // Validate reason
        const validReasons = ['inappropriate', 'spam', 'copyright', 'harassment', 'other'];
        if (!validReasons.includes(reason)) {
            res.status(400).json({ message: 'Invalid reason' });
            return;
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            res.status(400).json({ message: 'Invalid content ID format' });
            return;
        }

        // Check for duplicate report
        const existingReport = await Report.findOne({
            reportedBy: userId,
            contentId: new mongoose.Types.ObjectId(contentId),
        });

        if (existingReport) {
            res.status(409).json({ message: 'You have already reported this content' });
            return;
        }

        // Create report
        const report = await Report.create({
            reportedBy: new mongoose.Types.ObjectId(userId),
            contentType,
            contentId: new mongoose.Types.ObjectId(contentId),
            reason,
            details: details || undefined,
        });

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            reportId: report._id,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all reports (admin only)
 * GET /api/reports?status=pending&contentType=trailer
 */
export const getReports = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { status, contentType, page = '1', limit = '20' } = req.query;

        const query: any = {};
        if (status) query.status = status;
        if (contentType) query.contentType = contentType;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const [reports, total] = await Promise.all([
            Report.find(query)
                .populate('reportedBy', 'username email profile.displayName')
                .populate('reviewedBy', 'username email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Report.countDocuments(query),
        ]);

        res.json({
            items: reports,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a specific report (admin only)
 * GET /api/reports/:id
 */
export const getReport = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid report ID' });
            return;
        }

        const report = await Report.findById(id)
            .populate('reportedBy', 'username email profile.displayName')
            .populate('reviewedBy', 'username email')
            .lean();

        if (!report) {
            res.status(404).json({ message: 'Report not found' });
            return;
        }

        res.json(report);
    } catch (error) {
        next(error);
    }
};

/**
 * Update report status (admin only)
 * PATCH /api/reports/:id
 */
export const updateReport = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        const { status, reviewNotes } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid report ID' });
            return;
        }

        // Validate status
        const validStatuses = ['pending', 'reviewed', 'dismissed', 'actioned'];
        if (status && !validStatuses.includes(status)) {
            res.status(400).json({ message: 'Invalid status' });
            return;
        }

        const updateData: any = {};
        if (status) {
            updateData.status = status;
            updateData.reviewedBy = new mongoose.Types.ObjectId(userId);
        }
        if (reviewNotes !== undefined) {
            updateData.reviewNotes = reviewNotes;
        }

        const report = await Report.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('reportedBy', 'username email profile.displayName')
            .populate('reviewedBy', 'username email');

        if (!report) {
            res.status(404).json({ message: 'Report not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Report updated successfully',
            report,
        });
    } catch (error) {
        next(error);
    }
};
