'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usersAPI } from '@/lib/api';
import { User, UserActivity, UserReport } from '@/lib/types';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
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
                setError(err.response?.data?.message || 'Failed to load user');
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
            // Close modal after success
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
            console.error('Failed to update user status:', err);
            alert(err.response?.data?.message || 'Failed to update user status');
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
                        <div className="h-8 bg-bg-secondary rounded w-1/3" />
                        <div className="bg-bg-card rounded-lg p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-bg-secondary rounded-full" />
                                <div className="space-y-2">
                                    <div className="h-6 bg-bg-secondary rounded w-48" />
                                    <div className="h-4 bg-bg-secondary rounded w-32" />
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
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error || 'User not found'}
                    </div>
                    <Link href="/dashboard/users" className="text-gold-500 hover:text-gold-400 mt-4 inline-block">
                        ← Back to Users
                    </Link>
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
                <Link href="/dashboard/users" className="text-gold-500 hover:text-gold-400 mb-6 inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Users
                </Link>

                {/* User Profile Card */}
                <div className="bg-bg-card rounded-lg shadow-lg border border-border-default p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-white font-bold text-2xl">
                                {user.profile?.avatarUrl ? (
                                    <img src={user.profile.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>

                            {/* User Info */}
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">
                                    {user.profile?.displayName || user.name}
                                </h1>
                                {user.username && (
                                    <p className="text-text-secondary">@{user.username}</p>
                                )}
                                <p className="text-text-secondary text-sm">{user.email}</p>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${user.role === 'admin' || user.role === 'super_admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role?.replace('_', ' ') || 'user'}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${user.profileType === 'creator'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.profileType || 'unknown'}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.suspended
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.suspended ? 'Suspended' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={openSuspendModal}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${user.suspended
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                        >
                            {user.suspended ? 'Unsuspend User' : 'Suspend User'}
                        </button>
                    </div>

                    {/* Bio */}
                    {user.profile?.bio && (
                        <div className="mt-4 pt-4 border-t border-border-default">
                            <h3 className="text-sm font-medium text-text-secondary mb-1">Bio</h3>
                            <p className="text-text-primary">{user.profile.bio}</p>
                        </div>
                    )}

                    {/* Creative Focus */}
                    {user.profile?.creativeFocus && user.profile.creativeFocus.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-text-secondary mb-2">Creative Focus</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.profile.creativeFocus.map((focus, i) => (
                                    <span key={i} className="px-3 py-1 bg-bg-secondary rounded-full text-sm text-text-primary">
                                        {focus}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Metrics Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-bg-card rounded-lg shadow border border-border-default p-6 text-center">
                        <div className="text-3xl font-bold text-gold-500">{user.metrics?.followersCount || 0}</div>
                        <div className="text-text-secondary text-sm">Followers</div>
                    </div>
                    <div className="bg-bg-card rounded-lg shadow border border-border-default p-6 text-center">
                        <div className="text-3xl font-bold text-gold-500">{user.metrics?.followingCount || 0}</div>
                        <div className="text-text-secondary text-sm">Following</div>
                    </div>
                    <div className="bg-bg-card rounded-lg shadow border border-border-default p-6 text-center">
                        <div className="text-3xl font-bold text-gold-500">{user.metrics?.totalLikesReceived || 0}</div>
                        <div className="text-text-secondary text-sm">Total Likes</div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-bg-card rounded-lg shadow-lg border border-border-default p-6 mb-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Account Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-text-secondary">User ID:</span>
                            <span className="ml-2 text-text-primary font-mono">{user._id || user.id}</span>
                        </div>
                        <div>
                            <span className="text-text-secondary">Joined:</span>
                            <span className="ml-2 text-text-primary">{formatDate(user.createdAt)}</span>
                        </div>
                        {user.profile?.website && (
                            <div className="col-span-2">
                                <span className="text-text-secondary">Website:</span>
                                <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-gold-500 hover:text-gold-400">
                                    {user.profile.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reports Section */}
                <div className="bg-bg-card rounded-lg shadow-lg border border-border-default p-6 mb-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Reports Involving User</h2>

                    {/* Reports Filed BY User */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-text-secondary mb-2">Reports Filed by User ({reportsFiled.length})</h3>
                        {reportsFiled.length > 0 ? (
                            <div className="space-y-2">
                                {reportsFiled.map((report) => (
                                    <Link
                                        key={report._id}
                                        href={`/dashboard/reports/${report._id}`}
                                        className="flex items-center justify-between py-2 px-3 bg-bg-secondary rounded-lg hover:bg-bg-secondary/80 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-orange-500">⚠️</span>
                                            <span className="text-text-primary text-sm capitalize">{report.reason} ({report.contentType})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                report.status === 'actioned' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-text-secondary text-xs">{formatDateTime(report.createdAt)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-secondary text-sm">No reports filed</p>
                        )}
                    </div>

                    {/* Reports AGAINST User's Content */}
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">Reports Against User's Content ({reportsAgainst.length})</h3>
                        {reportsAgainst.length > 0 ? (
                            <div className="space-y-2">
                                {reportsAgainst.map((report) => (
                                    <Link
                                        key={report._id}
                                        href={`/dashboard/reports/${report._id}`}
                                        className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-500">🚨</span>
                                            <span className="text-text-primary text-sm capitalize">{report.reason} ({report.contentType})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                report.status === 'actioned' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-text-secondary text-xs">{formatDateTime(report.createdAt)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-secondary text-sm">No reports against user's content</p>
                        )}
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-bg-card rounded-lg shadow-lg border border-border-default p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
                    {activity.length > 0 ? (
                        <div className="space-y-3">
                            {activity.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 py-2 border-b border-border-default last:border-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${item.type === 'upload' ? 'bg-blue-500' :
                                        item.type === 'comment' ? 'bg-green-500' : 'bg-orange-500'
                                        }`}>
                                        {item.type === 'upload' ? '📹' : item.type === 'comment' ? '💬' : '⚠️'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-text-primary text-sm">{item.description}</p>
                                        <p className="text-text-secondary text-xs">{formatDateTime(item.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-secondary text-sm">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    );
}
