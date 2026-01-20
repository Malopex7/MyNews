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
            return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
        case 'moderator':
            return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        default:
            return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
};

const getProfileTypeBadgeClasses = (type: string) => {
    switch (type) {
        case 'creator':
            return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        case 'fan':
            return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        default:
            return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
};

const getStatusBadge = (suspended?: boolean) => {
    if (suspended) {
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Suspended</span>;
    }
    return <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>;
};

export default function UsersTable({ users, isLoading }: UsersTableProps) {
    if (isLoading) {
        return (
            <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] p-6">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#13131f] border-b border-[#2d2d42]">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">User</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Email</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Role</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Profile</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d2d42]">
                        {users.map((user, index) => (
                            <tr key={user._id || `user-${index}`} className="group hover:bg-[#2d2d42]/30 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-inner flex items-center justify-center text-white font-bold text-sm border border-white/10">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-blue-400 transition-colors">{user.name}</div>
                                            {user.handle && (
                                                <div className="text-sm text-gray-500">@{user.handle}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-400">{user.email}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${getRoleBadgeClasses(user.role)}`}>
                                        {user.role?.replace('_', ' ') || 'user'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${getProfileTypeBadgeClasses(user.profileType)}`}>
                                        {user.profileType || 'unknown'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    {getStatusBadge(user.suspended)}
                                </td>
                                <td className="py-4 px-6">
                                    <Link
                                        href={`/dashboard/users/${user._id || user.id}`}
                                        className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors py-1 px-3 rounded hover:bg-blue-500/10"
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
