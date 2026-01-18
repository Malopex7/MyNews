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

        // Track reason breakdown across all days
        const reasonCounts: Record<string, number> = {
            inappropriate: 0,
            spam: 0,
            copyright: 0,
            harassment: 0,
            other: 0,
        };

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = dataMap.get(dateStr);

            // Count reasons for pie chart
            if (dayData?.reasons) {
                dayData.reasons.forEach((r: string) => {
                    if (reasonCounts[r] !== undefined) {
                        reasonCounts[r]++;
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

        // Calculate summary
        const totalReports = filledData.reduce((sum, d) => sum + d.count, 0);
        const totalPending = filledData.reduce((sum, d) => sum + d.pending, 0);
        const totalResolved = filledData.reduce((sum, d) => sum + d.resolved, 0);

        res.json({
            period: days,
            data: filledData,
            reasonBreakdown: reasonCounts,
            summary: {
                totalReports,
                totalPending,
                totalResolved,
                resolutionRate: totalReports > 0
                    ? Math.round((totalResolved / totalReports) * 100)
                    : 0,
                averagePerDay: days > 0 ? Math.round((totalReports / days) * 10) / 10 : 0,
            },
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};
