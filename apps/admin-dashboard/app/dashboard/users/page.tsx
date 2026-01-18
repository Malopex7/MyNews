'use client';

import { useEffect, useState } from 'react';
import { usersAPI } from '@/lib/api';
import { User } from '@/lib/types';
import UsersTable from '@/components/users/UsersTable';
import UserFilters from '@/components/users/UserFilters';
import Pagination from '@/components/common/Pagination';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Filter states
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [profileTypeFilter, setProfileTypeFilter] = useState('');

    const ITEMS_PER_PAGE = 10;

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [roleFilter, statusFilter, profileTypeFilter]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await usersAPI.getAll({
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search: debouncedSearch || undefined,
                    role: roleFilter || undefined,
                    status: statusFilter || undefined,
                    profileType: profileTypeFilter || undefined,
                });

                if (response && Array.isArray(response.items)) {
                    setUsers(response.items);
                    setTotalPages(response.totalPages || 1);
                } else if (Array.isArray(response)) {
                    setUsers(response);
                    setTotalPages(1);
                } else {
                    console.error('Unexpected API response format:', response);
                    setUsers([]);
                }
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch users:', err);
                const status = err.response?.status;
                const message = err.response?.data?.message || err.message;

                if (status === 403) {
                    setError('Access denied. You do not have admin permissions.');
                } else if (status === 401) {
                    setError('Session expired. Please log in again.');
                } else {
                    setError(`Failed to load users: ${message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, debouncedSearch, roleFilter, statusFilter, profileTypeFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasActiveFilters = roleFilter || statusFilter || profileTypeFilter || debouncedSearch;

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary mb-2">
                                User Management
                            </h1>
                            <p className="text-text-secondary">
                                View and manage platform users.
                            </p>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-80 px-4 py-2 pl-10 bg-bg-secondary border border-border-default rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-text-secondary">Filters:</span>
                        <UserFilters
                            role={roleFilter}
                            status={statusFilter}
                            profileType={profileTypeFilter}
                            onRoleChange={setRoleFilter}
                            onStatusChange={setStatusFilter}
                            onProfileTypeChange={setProfileTypeFilter}
                        />
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setRoleFilter('');
                                    setStatusFilter('');
                                    setProfileTypeFilter('');
                                    setSearchQuery('');
                                }}
                                className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : (
                    <>
                        <UsersTable users={users} isLoading={isLoading} />
                        {!isLoading && !error && users.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                        {!isLoading && !error && users.length === 0 && (
                            <div className="text-center py-12 text-text-secondary">
                                {hasActiveFilters
                                    ? 'No users found matching the selected filters.'
                                    : 'No users found.'}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
