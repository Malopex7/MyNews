'use client';

interface UserFiltersProps {
    role: string;
    status: string;
    profileType: string;
    onRoleChange: (role: string) => void;
    onStatusChange: (status: string) => void;
    onProfileTypeChange: (profileType: string) => void;
}

const selectClasses = "px-3 py-2 bg-[#1c1c2e] border border-[#2d2d42] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer";

export default function UserFilters({
    role,
    status,
    profileType,
    onRoleChange,
    onStatusChange,
    onProfileTypeChange,
}: UserFiltersProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {/* Role Filter */}
            <select
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                className={selectClasses}
            >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="moderator">Moderator</option>
            </select>

            {/* Status Filter */}
            <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className={selectClasses}
            >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
            </select>

            {/* Profile Type Filter */}
            <select
                value={profileType}
                onChange={(e) => onProfileTypeChange(e.target.value)}
                className={selectClasses}
            >
                <option value="">All Profiles</option>
                <option value="creator">Creator</option>
                <option value="fan">Fan</option>
            </select>
        </div>
    );
}
