'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { AdminStats, UserAnalytics, ContentAnalytics, ReportAnalytics, DashboardActivity } from '@/lib/types';
import MetricsCard from '@/components/common/MetricsCard';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import UserGrowthChart from '@/components/dashboard/UserGrowthChart';
import ContentCreationChart from '@/components/dashboard/ContentCreationChart';
import ReportVolumeChart from '@/components/dashboard/ReportVolumeChart';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';

// Icons (simple SVG components)
const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

const FilmIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
);

const FlagIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
);

const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const HeartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const AlertIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
    const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics | null>(null);
    const [reportAnalytics, setReportAnalytics] = useState<ReportAnalytics | null>(null);
    const [activity, setActivity] = useState<DashboardActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [statsData, userData, contentData, reportData, activityData] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUserAnalytics('30'),
                adminAPI.getContentAnalytics('30'),
                adminAPI.getReportAnalytics('30'),
                adminAPI.getRecentActivity(10)
            ]);

            setStats(statsData);
            setUserAnalytics(userData);
            setContentAnalytics(contentData);
            setReportAnalytics(reportData);
            setActivity(activityData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (error && !loading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
                    </div>
                    <ErrorDisplay
                        title="Failed to load dashboard"
                        message={error}
                        onRetry={fetchData}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Welcome back, {user?.username}!
                    </h1>
                    <p className="text-text-secondary">
                        Here&apos;s what&apos;s happening with FanFlick today.
                    </p>
                </div>

                {/* User Metrics */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Users</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricsCard
                            title="Total Users"
                            value={stats?.users.total ?? 0}
                            subtitle={`${stats?.users.newToday ?? 0} new today`}
                            icon={<UsersIcon />}
                            color="blue"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Creators"
                            value={stats?.users.creators ?? 0}
                            subtitle="Active content creators"
                            icon={<FilmIcon />}
                            color="purple"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Viewers"
                            value={stats?.users.viewers ?? 0}
                            subtitle="Content consumers"
                            icon={<EyeIcon />}
                            color="green"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Suspended"
                            value={stats?.users.suspended ?? 0}
                            subtitle="Accounts suspended"
                            icon={<AlertIcon />}
                            color="red"
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Content Metrics */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Content</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricsCard
                            title="Total Trailers"
                            value={stats?.content.total ?? 0}
                            subtitle={`${stats?.content.newThisWeek ?? 0} this week`}
                            icon={<FilmIcon />}
                            color="green"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Total Views"
                            value={stats?.content.totalViews ?? 0}
                            subtitle="All-time views"
                            icon={<EyeIcon />}
                            color="blue"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Total Likes"
                            value={stats?.content.totalLikes ?? 0}
                            subtitle="All-time likes"
                            icon={<HeartIcon />}
                            color="purple"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Avg Views/Trailer"
                            value={stats?.engagement.avgViewsPerContent ?? 0}
                            subtitle="Average per trailer"
                            icon={<EyeIcon />}
                            color="orange"
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Reports Metrics */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Reports</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricsCard
                            title="Pending Reports"
                            value={stats?.reports.pending ?? 0}
                            subtitle="Awaiting review"
                            icon={<FlagIcon />}
                            color="yellow"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Total Reports"
                            value={stats?.reports.total ?? 0}
                            subtitle={`${stats?.reports.newThisWeek ?? 0} this week`}
                            icon={<FlagIcon />}
                            color="orange"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Reviewed"
                            value={stats?.reports.reviewed ?? 0}
                            subtitle="Reviewed but no action"
                            icon={<EyeIcon />}
                            color="blue"
                            loading={loading}
                        />
                        <MetricsCard
                            title="Actioned"
                            value={stats?.reports.actioned ?? 0}
                            subtitle="Action taken"
                            icon={<AlertIcon />}
                            color="green"
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Analytics Charts & Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
                    {/* Row 1 */}
                    <div className="lg:col-span-2">
                        <UserGrowthChart data={userAnalytics} loading={loading} />
                    </div>
                    <div className="lg:col-span-1">
                        <ReportVolumeChart data={reportAnalytics} loading={loading} />
                    </div>

                    {/* Row 2 */}
                    <div className="lg:col-span-2">
                        <ContentCreationChart data={contentAnalytics} loading={loading} />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentActivityFeed activities={activity} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
}

