import { Request, Response, NextFunction } from 'express';
import { User, Media, Report, Comment } from '../models';

/**
 * Get platform-wide admin statistics
 * GET /api/admin/stats
 */
export const getStats = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get date ranges for comparisons
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Run all aggregations in parallel
        const [
            totalUsers,
            totalCreators,
            totalViewers,
            suspendedUsers,
            newUsersToday,
            newUsersThisWeek,
            newUsersThisMonth,
            totalContent,
            contentThisWeek,
            contentThisMonth,
            totalReports,
            pendingReports,
            reviewedReports,
            actionedReports,
            reportsThisWeek,
            totalComments,
            contentMetrics,
        ] = await Promise.all([
            // User counts
            User.countDocuments(),
            User.countDocuments({ profileType: 'creator' }),
            User.countDocuments({ profileType: 'viewer' }),
            User.countDocuments({ suspended: true }),
            User.countDocuments({ createdAt: { $gte: todayStart } }),
            User.countDocuments({ createdAt: { $gte: weekAgo } }),
            User.countDocuments({ createdAt: { $gte: monthAgo } }),

            // Content counts (only videos/trailers)
            Media.countDocuments({ type: 'video' }),
            Media.countDocuments({ type: 'video', createdAt: { $gte: weekAgo } }),
            Media.countDocuments({ type: 'video', createdAt: { $gte: monthAgo } }),

            // Report counts
            Report.countDocuments(),
            Report.countDocuments({ status: 'pending' }),
            Report.countDocuments({ status: 'reviewed' }),
            Report.countDocuments({ status: 'actioned' }),
            Report.countDocuments({ createdAt: { $gte: weekAgo } }),

            // Comments count
            Comment.countDocuments(),

            // Aggregate content metrics
            Media.aggregate([
                { $match: { type: 'video' } },
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: '$metrics.views' },
                        totalLikes: { $sum: '$metrics.likes' },
                        totalShares: { $sum: '$metrics.shares' },
                        totalComments: { $sum: '$metrics.comments' },
                    },
                },
            ]),
        ]);

        // Extract metrics or default to zeros
        const metrics = contentMetrics[0] || {
            totalViews: 0,
            totalLikes: 0,
            totalShares: 0,
            totalComments: 0,
        };

        res.json({
            users: {
                total: totalUsers,
                creators: totalCreators,
                viewers: totalViewers,
                suspended: suspendedUsers,
                newToday: newUsersToday,
                newThisWeek: newUsersThisWeek,
                newThisMonth: newUsersThisMonth,
            },
            content: {
                total: totalContent,
                newThisWeek: contentThisWeek,
                newThisMonth: contentThisMonth,
                totalViews: metrics.totalViews,
                totalLikes: metrics.totalLikes,
                totalShares: metrics.totalShares,
            },
            reports: {
                total: totalReports,
                pending: pendingReports,
                reviewed: reviewedReports,
                actioned: actionedReports,
                newThisWeek: reportsThisWeek,
            },
            engagement: {
                totalComments: totalComments,
                avgViewsPerContent: totalContent > 0 ? Math.round(metrics.totalViews / totalContent) : 0,
                avgLikesPerContent: totalContent > 0 ? Math.round(metrics.totalLikes / totalContent) : 0,
            },
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user growth analytics data for charts
 * GET /api/admin/analytics/users?period=30
 */
export const getUserAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const period = parseInt(req.query.period as string) || 30; // Default 30 days
        const validPeriods = [7, 30, 90];
        const days = validPeriods.includes(period) ? period : 30;

        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        // Aggregate daily user registrations
        const dailyRegistrations = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                    },
                    count: { $sum: 1 },
                    creators: {
                        $sum: { $cond: [{ $eq: ['$profileType', 'creator'] }, 1, 0] },
                    },
                    viewers: {
                        $sum: { $cond: [{ $eq: ['$profileType', 'viewer'] }, 1, 0] },
                    },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day',
                        },
                    },
                    count: 1,
                    creators: 1,
                    viewers: 1,
                },
            },
        ]);

        // Fill in missing days with zero counts
        const filledData: Array<{ date: string; count: number; creators: number; viewers: number }> = [];
        const dataMap = new Map(
            dailyRegistrations.map((d) => [
                new Date(d.date).toISOString().split('T')[0],
                d,
            ])
        );

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = dataMap.get(dateStr);

            filledData.push({
                date: dateStr,
                count: dayData?.count || 0,
                creators: dayData?.creators || 0,
                viewers: dayData?.viewers || 0,
            });
        }

        // Calculate summary stats
        const totalNewUsers = filledData.reduce((sum, d) => sum + d.count, 0);
        const totalNewCreators = filledData.reduce((sum, d) => sum + d.creators, 0);
        const totalNewViewers = filledData.reduce((sum, d) => sum + d.viewers, 0);
        const avgPerDay = days > 0 ? Math.round((totalNewUsers / days) * 10) / 10 : 0;

        res.json({
            period: days,
            data: filledData,
            summary: {
                totalNewUsers,
                totalNewCreators,
                totalNewViewers,
                averagePerDay: avgPerDay,
            },
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get content creation analytics data for charts
 * GET /api/admin/analytics/content?period=30
 */
export const getContentAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const period = parseInt(req.query.period as string) || 30;
        const validPeriods = [7, 30, 90];
        const days = validPeriods.includes(period) ? period : 30;

        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        // Aggregate daily content creation
        const dailyContent = await Media.aggregate([
            {
                $match: {
                    type: 'video',
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                    },
                    count: { $sum: 1 },
                    views: { $sum: '$metrics.views' },
                    likes: { $sum: '$metrics.likes' },
                    byType: {
                        $push: '$creativeType',
                    },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day',
                        },
                    },
                    count: 1,
                    views: 1,
                    likes: 1,
                    byType: 1,
                },
            },
        ]);

        // Fill in missing days
        const filledData: Array<{
            date: string;
            count: number;
            views: number;
            likes: number;
            original: number;
            parody: number;
            remix: number;
            response: number;
        }> = [];

        const dataMap = new Map(
            dailyContent.map((d) => [
                new Date(d.date).toISOString().split('T')[0],
                d,
            ])
        );

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = dataMap.get(dateStr);

            // Count creative types
            const types = dayData?.byType || [];
            const original = types.filter((t: string) => t === 'Original').length;
            const parody = types.filter((t: string) => t === 'Parody').length;
            const remix = types.filter((t: string) => t === 'Remix').length;
            const response = types.filter((t: string) => t === 'Response').length;

            filledData.push({
                date: dateStr,
                count: dayData?.count || 0,
                views: dayData?.views || 0,
                likes: dayData?.likes || 0,
                original,
                parody,
                remix,
                response,
            });
        }

        // Calculate summary
        const totalContent = filledData.reduce((sum, d) => sum + d.count, 0);
        const totalViews = filledData.reduce((sum, d) => sum + d.views, 0);
        const totalLikes = filledData.reduce((sum, d) => sum + d.likes, 0);

        res.json({
            period: days,
            data: filledData,
            summary: {
                totalContent,
                totalViews,
                totalLikes,
                averagePerDay: days > 0 ? Math.round((totalContent / days) * 10) / 10 : 0,
            },
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get report volume analytics data for charts
 * GET /api/admin/analytics/reports?period=30
 */
export const getReportAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const period = parseInt(req.query.period as string) || 30;
        const validPeriods = [7, 30, 90];
        const days = validPeriods.includes(period) ? period : 30;

        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        // Aggregate daily reports
        const dailyReports = await Report.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                    },
                    count: { $sum: 1 },
                    reasons: { $push: '$reason' },
                    statuses: { $push: '$status' },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day',
                        },
                    },
                    count: 1,
                    reasons: 1,
                    statuses: 1,
                },
            },
        ]);

        // Fill in missing days
        const filledData: Array<{
            date: string;
            count: number;
            pending: number;
            resolved: number;
        }> = [];

        const dataMap = new Map(
            dailyReports.map((d) => [
                new Date(d.date).toISOString().split('T')[0],
                d,
            ])
        );

        // Track breakdowns across all days
        const reasonCounts: Record<string, number> = {
            inappropriate: 0,
            spam: 0,
            copyright: 0,
            harassment: 0,
            other: 0,
        };

        const statusCounts: Record<string, number> = {
            pending: 0,
            reviewed: 0,
            dismissed: 0,
            actioned: 0,
        };

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = dataMap.get(dateStr);

            // Count reasons
            if (dayData?.reasons) {
                dayData.reasons.forEach((r: string) => {
                    if (reasonCounts[r] !== undefined) {
                        reasonCounts[r]++;
                    }
                });
            }

            // Count statuses
            if (dayData?.statuses) {
                dayData.statuses.forEach((s: string) => {
                    if (statusCounts[s] !== undefined) {
                        statusCounts[s]++;
                    }
                });
            }

            // Count pending vs resolved
            const statuses = dayData?.statuses || [];
            const pending = statuses.filter((s: string) => s === 'pending').length;
            const resolved = statuses.filter((s: string) => s !== 'pending').length;

            filledData.push({
                date: dateStr,
                count: dayData?.count || 0,
                pending,
                resolved,
            });
        }

        // Format for frontend
        const byReason = Object.entries(reasonCounts).map(([key, value]) => ({
            _id: key,
            count: value
        }));

        const byStatus = Object.entries(statusCounts).map(([key, value]) => ({
            _id: key,
            count: value
        }));

        // Calculate summary
        const totalReports = filledData.reduce((sum, d) => sum + d.count, 0);
        const totalPending = statusCounts.pending;
        const totalResolved = totalReports - totalPending;

        res.json({
            period: days,
            data: filledData,
            byReason,
            byStatus,
            summary: {
                totalReports,
                totalPending,
                totalResolved,
                resolutionRate: totalReports > 0
                    ? parseFloat((totalResolved / totalReports).toFixed(2))
                    : 0,
                averagePerDay: days > 0 ? Math.round((totalReports / days) * 10) / 10 : 0,
            },
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get recent activity across the platform
 * GET /api/admin/activity?limit=10
 */
export const getRecentActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        // Fetch latest users, content, and reports
        const [latestUsers, latestMedia, latestReports] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(limit).lean(),
            Media.find({ type: 'video' }).sort({ createdAt: -1 }).limit(limit).lean(),
            Report.find().sort({ createdAt: -1 }).limit(limit).lean(),
        ]);

        // Transform into unified activity format
        const activities: any[] = [];

        latestUsers.forEach((user: any) => {
            activities.push({
                _id: `user_${user._id}`,
                type: 'user_register',
                description: `New user ${user.username || user.email} joined as a ${user.profileType}`,
                metadata: {
                    userId: user._id,
                    username: user.username,
                },
                createdAt: user.createdAt,
            });
        });

        latestMedia.forEach((media: any) => {
            activities.push({
                _id: `media_${media._id}`,
                type: 'content_upload',
                description: `New trailer "${media.title}" uploaded by user ${media.userId}`,
                metadata: {
                    contentId: media._id,
                    userId: media.userId,
                    contentType: media.creativeType,
                },
                createdAt: media.createdAt,
            });
        });

        latestReports.forEach((report: any) => {
            activities.push({
                _id: `report_${report._id}`,
                type: 'report_filed',
                description: `New report filed: ${report.reason} for ${report.targetType}`,
                metadata: {
                    reportId: report._id,
                    reason: report.reason,
                },
                createdAt: report.createdAt,
            });
        });

        // Sort by date descending and limit
        const sortedActivities = activities
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

        res.json(sortedActivities);
    } catch (error) {
        next(error);
    }
};

/**
 * Get moderateable content (trailers and comments)
 * GET /api/admin/content
 */
export const getContent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const type = (req.query.type as string) || 'all'; // 'video', 'comment', 'all'
        const sort = (req.query.sort as string) || 'newest'; // 'newest', 'oldest', 'reported'
        const search = req.query.search as string;

        const skip = (page - 1) * limit;
        const items: any[] = [];
        let total = 0;

        // Build sort object
        const sortOptions: any = {};
        if (sort === 'oldest') {
            sortOptions.createdAt = 1;
        } else {
            sortOptions.createdAt = -1;
        }

        // Build query objects upfront
        const mediaQuery: any = { type: 'video' };
        const commentQuery: any = {};

        if (search) {
            mediaQuery.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
            commentQuery.text = { $regex: search, $options: 'i' };
        }

        // Process based on type
        if (type === 'video') {
            const [mediaResults, mediaCount] = await Promise.all([
                Media.find(mediaQuery)
                    .sort(sortOptions)
                    .limit(limit)
                    .skip(skip)
                    .populate('uploadedBy', 'name email profile.avatar')
                    .lean(),
                Media.countDocuments(mediaQuery)
            ]);

            items.push(...mediaResults.map(m => ({
                ...m,
                entityType: 'video',
                author: m.uploadedBy,
                content: m.description,
            })));
            total = mediaCount;

        } else if (type === 'comment') {
            const [commentResults, commentCount] = await Promise.all([
                Comment.find(commentQuery)
                    .sort(sortOptions)
                    .limit(limit)
                    .skip(skip)
                    .populate('userId', 'name email profile.avatar')
                    .populate('mediaId', 'title')
                    .lean(),
                Comment.countDocuments(commentQuery)
            ]);

            items.push(...commentResults.map(c => ({
                ...c,
                entityType: 'comment',
                author: c.userId,
                content: c.text,
                title: `Comment on "${(c as any).mediaId?.title || 'Video'}"`,
            })));
            total = commentCount;

        } else {
            // 'all' case - combine and sort manually (simplified)
            // Fetch from both collections and merge
            const [mediaResults, commentResults] = await Promise.all([
                Media.find(mediaQuery)
                    .sort(sortOptions)
                    .limit(limit)
                    .skip(skip)
                    .populate('uploadedBy', 'name email profile.avatar')
                    .lean(),
                Comment.find(commentQuery)
                    .sort(sortOptions)
                    .limit(limit)
                    .skip(skip)
                    .populate('userId', 'name email profile.avatar')
                    .populate('mediaId', 'title')
                    .lean()
            ]);

            const videos = mediaResults.map(m => ({
                ...m,
                entityType: 'video',
                author: m.uploadedBy,
                content: m.description,
            }));

            const comments = commentResults.map(c => ({
                ...c,
                entityType: 'comment',
                author: c.userId,
                content: c.text,
                title: `Comment on "${(c as any).mediaId?.title || 'Video'}"`,
            }));

            // Merge and sort
            items.push(...videos, ...comments);
            items.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sort === 'oldest' ? dateA - dateB : dateB - dateA;
            });

            // Slice to page limit after merge
            if (items.length > limit) items.length = limit;

            // Total is approx sum (not accurate for pagination across collections)
            total = items.length;
        }

        res.json({
            items,
            total,
            page,
            limit
        });

    } catch (error) {
        next(error);
    }
};

// Import AuditLog (assuming it's exported from models)
import { AuditLog } from '../models';

/**
 * Create an audit log entry
 * POST /api/admin/audit-log
 */
export const createAuditLog = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { action, targetType, targetId, details } = req.body;
        const adminId = (req as any).user.userId;

        const auditLog = await AuditLog.create({
            adminId,
            action,
            targetType,
            targetId,
            details,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        res.status(201).json(auditLog);
    } catch (error) {
        next(error);
    }
};

/**
 * Get audit logs
 * GET /api/admin/audit-log
 */
export const getAuditLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const action = req.query.action as string;
        const targetType = req.query.targetType as string;
        const adminId = req.query.adminId as string;

        const skip = (page - 1) * limit;

        const query: any = {};
        if (action) query.action = action;
        if (targetType) query.targetType = targetType;
        if (adminId) query.adminId = adminId;

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('adminId', 'name email')
                .lean(),
            AuditLog.countDocuments(query),
        ]);

        res.json({
            items: logs,
            total,
            page,
            limit,
        });
    } catch (error) {
        next(error);
    }
};
