'use client';

import { formatDistanceToNow } from 'date-fns';
import { DashboardActivity } from '@/lib/types';

interface RecentActivityFeedProps {
    activities: DashboardActivity[];
    loading: boolean;
}

const ActivityIcon = ({ type }: { type: DashboardActivity['type'] }) => {
    switch (type) {
        case 'user_register':
            return (
                <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-400 shadow-lg shadow-blue-500/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
            );
        case 'content_upload':
            return (
                <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400 shadow-lg shadow-emerald-500/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                </div>
            );
        case 'report_filed':
            return (
                <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400 shadow-lg shadow-amber-500/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="bg-gray-500/20 p-2.5 rounded-xl text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
    }
};

export default function RecentActivityFeed({ activities, loading }: RecentActivityFeedProps) {
    if (loading) {
        return (
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#1a1a2e] rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[#1a1a2e] rounded-lg w-3/4" />
                                <div className="h-3 bg-[#1a1a2e] rounded-lg w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!activities?.length) {
        return (
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No recent activity</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1c1c2e] border border-[#2d2d42] rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[420px]">
            <h3 className="text-xl font-bold text-white mb-4 flex-shrink-0">Recent Activity</h3>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-[#2a2a4a] scrollbar-track-transparent">
                {activities.map((activity) => (
                    <div
                        key={activity._id}
                        className="flex items-start gap-4 group"
                    >
                        <ActivityIcon type={activity.type} />
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-200 text-sm leading-relaxed">
                                {activity.description}
                            </p>
                            <p className="text-gray-600 text-xs mt-1.5">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
