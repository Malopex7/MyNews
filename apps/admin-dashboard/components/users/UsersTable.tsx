'use client';

import Link from 'next/link';
import { User } from '@/lib/types';

interface UsersTableProps {
    users: User[];
    isLoading: boolean;
}

const LoadingSkeleton = () => (
    <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-border-default py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-bg-secondary rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bg-secondary rounded w-1/4" />
                    <div className="h-3 bg-bg-secondary rounded w-1/3" />
                </div>
                <div className="h-6 bg-bg-secondary rounded w-16" />
            </div>
        ))}
    </div>
);

const getRoleBadgeClasses = (role: string) => {
    switch (role) {
        case 'admin':
        case 'super_admin':
            return 'bg-purple-100 text-purple-800';
        case 'moderator':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getProfileTypeBadgeClasses = (type: string) => {
    switch (type) {
        case 'creator':
            return 'bg-amber-100 text-amber-800';
        case 'fan':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

const getStatusBadge = (suspended?: boolean) => {
    if (suspended) {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Suspended</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
};

export default function UsersTable({ users, isLoading }: UsersTableProps) {
    if (isLoading) {
        return (
            <div className="bg-bg-card rounded-lg shadow-lg border border-border-default p-6">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="bg-bg-card rounded-lg shadow-lg border border-border-default overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-bg-secondary border-b border-border-default">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-primary">User</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-primary">Email</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-primary">Role</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-primary">Profile</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-primary">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-text-primary">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id || `user-${index}`} className="border-b border-border-default hover:bg-bg-secondary/50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-primary">{user.name}</div>
                                            {user.handle && (
                                                <div className="text-sm text-text-secondary">@{user.handle}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-text-secondary">{user.email}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleBadgeClasses(user.role)}`}>
                                        {user.role?.replace('_', ' ') || 'user'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getProfileTypeBadgeClasses(user.profileType)}`}>
                                        {user.profileType || 'unknown'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    {getStatusBadge(user.suspended)}
                                </td>
                                <td className="py-4 px-6">
                                    <Link
                                        href={`/dashboard/users/${user._id || user.id}`}
                                        className="text-gold-500 hover:text-gold-400 font-medium text-sm transition-colors"
                                    >
                                        View Details →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
