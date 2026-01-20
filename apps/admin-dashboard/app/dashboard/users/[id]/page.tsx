'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usersAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useToast } from '@/contexts/ToastContext';
import { User, UserActivity, UserReport } from '@/lib/types';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [activity, setActivity] = useState<UserActivity[]>([]);
    const [reportsFiled, setReportsFiled] = useState<UserReport[]>([]);
    const [reportsAgainst, setReportsAgainst] = useState<UserReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const [userData, activityData, reportsData] = await Promise.all([
                    usersAPI.getById(userId),
                    usersAPI.getActivity(userId, 10).catch(() => ({ items: [] })),
                    usersAPI.getReports(userId, 10).catch(() => ({ reportsFiled: [], reportsAgainst: [] })),
                ]);
                setUser(userData);
                setActivity(activityData.items || []);
                setReportsFiled(reportsData.reportsFiled || []);
                setReportsAgainst(reportsData.reportsAgainst || []);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch user:', err);
                setError(getErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        isDangerous: false,
        isLoading: false,
    });

    const openSuspendModal = () => {
        if (!user) return;
        setConfirmModal({
            isOpen: true,
            title: user.suspended ? 'Unsuspend User?' : 'Suspend User?',
            message: user.suspended
                ? 'Are you sure you want to reactivate this user account? They will regain access immediately.'
                : 'Are you sure you want to suspend this user? They will lose access to their account.',
            isDangerous: !user.suspended, // Suspension is dangerous/red
            isLoading: false,
        });
    };

    const confirmSuspendAction = async () => {
        if (!user) return;

        setConfirmModal(prev => ({ ...prev, isLoading: true }));

        try {
            if (user.suspended) {
                await usersAPI.unsuspend(userId);
                setUser({ ...user, suspended: false });
            } else {
                await usersAPI.suspend(userId);
                setUser({ ...user, suspended: true });
            }
            showToast('success', user.suspended ? 'User unsuspended successfully' : 'User suspended successfully');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
            console.error('Failed to update user status:', err);
            showToast('error', getErrorMessage(err));
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-[#1c1c2e] rounded w-1/3" />
                        <div className="bg-[#1c1c2e] rounded-xl p-6 space-y-4 border border-[#2d2d42]">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-[#2d2d42] rounded-full" />
                                <div className="space-y-2">
                                    <div className="h-6 bg-[#2d2d42] rounded w-48" />
                                    <div className="h-4 bg-[#2d2d42] rounded w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/dashboard/users" className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Users
                    </Link>
                    <ErrorDisplay
                        title="Failed to load user"
                        message={error || 'User not found'}
                        showBackButton={false}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                isDangerous={confirmModal.isDangerous}
                isLoading={confirmModal.isLoading}
                onConfirm={confirmSuspendAction}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />

            <div className="max-w-4xl mx-auto">
                {/* Back Link */}
                <Link href="/dashboard/users" className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Users
                </Link>

                {/* User Profile Card */}
                <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner border border-white/10">
                                {user.profile?.avatarUrl ? (
                                    <img src={user.profile.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>

                            {/* User Info */}
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    {user.profile?.displayName || user.name}
                                </h1>
                                {user.username && (
                                    <p className="text-gray-400">@{user.username}</p>
                                )}
                                <p className="text-gray-500 text-sm">{user.email}</p>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize border ${user.role === 'admin' || user.role === 'super_admin'
                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {user.role?.replace('_', ' ') || 'user'}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize border ${user.profileType === 'creator'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                                        }`}>
                                        {user.profileType || 'unknown'}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${user.suspended
                                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                                        }`}>
                                        {user.suspended ? 'Suspended' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={openSuspendModal}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-lg ${user.suspended
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-red-600 hover:bg-red-500 text-white'
                                }`}
                        >
                            {user.suspended ? 'Unsuspend User' : 'Suspend User'}
                        </button>
                    </div>

                    {/* Bio */}
                    {user.profile?.bio && (
                        <div className="mt-6 pt-6 border-t border-[#2d2d42]">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Bio</h3>
                            <p className="text-gray-200 leading-relaxed">{user.profile.bio}</p>
                        </div>
                    )}

                    {/* Creative Focus */}
                    {user.profile?.creativeFocus && user.profile.creativeFocus.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Creative Focus</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.profile.creativeFocus.map((focus, i) => (
                                    <span key={i} className="px-3 py-1 bg-[#2d2d42] rounded-full text-sm text-gray-300 border border-white/5">
                                        {focus}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Metrics Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6 text-center hover:border-blue-500/30 transition-colors">
                        <div className="text-3xl font-bold text-blue-400">{user.metrics?.followersCount || 0}</div>
                        <div className="text-gray-400 text-sm mt-1">Followers</div>
                    </div>
                    <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6 text-center hover:border-blue-500/30 transition-colors">
                        <div className="text-3xl font-bold text-blue-400">{user.metrics?.followingCount || 0}</div>
                        <div className="text-gray-400 text-sm mt-1">Following</div>
                    </div>
                    <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6 text-center hover:border-blue-500/30 transition-colors">
                        <div className="text-3xl font-bold text-blue-400">{user.metrics?.totalLikesReceived || 0}</div>
                        <div className="text-gray-400 text-sm mt-1">Total Likes</div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        Account Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div className="p-3 bg-[#13131f] rounded-lg border border-[#2d2d42]">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">User ID</span>
                            <span className="text-gray-300 font-mono select-all">{user._id || user.id}</span>
                        </div>
                        <div className="p-3 bg-[#13131f] rounded-lg border border-[#2d2d42]">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Joined</span>
                            <span className="text-gray-300">{formatDate(user.createdAt)}</span>
                        </div>
                        {user.profile?.website && (
                            <div className="col-span-1 sm:col-span-2 p-3 bg-[#13131f] rounded-lg border border-[#2d2d42]">
                                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Website</span>
                                <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                                    {user.profile.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reports Section */}
                <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Reports Involving User</h2>

                    {/* Reports Filed BY User */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                            Reports Filed by User
                            <span className="bg-[#2d2d42] text-gray-300 px-2 py-0.5 rounded-full text-xs">{reportsFiled.length}</span>
                        </h3>
                        {reportsFiled.length > 0 ? (
                            <div className="space-y-2">
                                {reportsFiled.map((report) => (
                                    <Link
                                        key={report._id}
                                        href={`/dashboard/reports/${report._id}`}
                                        className="flex items-center justify-between py-3 px-4 bg-[#2d2d42]/50 hover:bg-[#2d2d42] rounded-lg border border-[#2d2d42] transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-400 bg-orange-500/10 p-1.5 rounded-md">⚠️</span>
                                            <span className="text-gray-200 text-sm capitalize group-hover:text-white transition-colors">{report.reason} ({report.contentType})</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 text-xs rounded-full capitalize border ${report.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                report.status === 'actioned' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-gray-500 text-xs">{formatDateTime(report.createdAt)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic py-2">No reports filed</p>
                        )}
                    </div>

                    {/* Reports AGAINST User's Content */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                            Reports Against User's Content
                            <span className="bg-[#2d2d42] text-gray-300 px-2 py-0.5 rounded-full text-xs">{reportsAgainst.length}</span>
                        </h3>
                        {reportsAgainst.length > 0 ? (
                            <div className="space-y-2">
                                {reportsAgainst.map((report) => (
                                    <Link
                                        key={report._id}
                                        href={`/dashboard/reports/${report._id}`}
                                        className="flex items-center justify-between py-3 px-4 bg-red-500/5 hover:bg-red-500/10 rounded-lg border border-red-500/10 hover:border-red-500/20 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-red-400 bg-red-500/10 p-1.5 rounded-md">🚨</span>
                                            <span className="text-gray-200 text-sm capitalize group-hover:text-white transition-colors">{report.reason} ({report.contentType})</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 text-xs rounded-full capitalize border ${report.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                report.status === 'actioned' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-gray-500 text-xs">{formatDateTime(report.createdAt)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic py-2">No reports against user's content</p>
                        )}
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                    {activity.length > 0 ? (
                        <div className="space-y-3">
                            {activity.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 py-3 border-b border-[#2d2d42] last:border-0 hover:bg-[#2d2d42]/20 p-2 rounded-lg transition-colors">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shadow-md ${item.type === 'upload' ? 'bg-blue-600' :
                                        item.type === 'comment' ? 'bg-green-600' : 'bg-orange-600'
                                        }`}>
                                        {item.type === 'upload' ? '📹' : item.type === 'comment' ? '💬' : '⚠️'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-200 text-sm">{item.description}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{formatDateTime(item.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    );
}
