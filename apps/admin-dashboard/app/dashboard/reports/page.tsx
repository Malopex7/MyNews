'use client';

import { useEffect, useState } from 'react';
import { reportsAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { Report, ReportStatus } from '@/lib/types';
import ReportsTable from '@/components/reports/ReportsTable';
import Pagination from '@/components/common/Pagination';
import StatusFilter from '@/components/reports/StatusFilter';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

// Mock data integration flag - remove when real API is populated
const USE_MOCK_DATA = false;

const MOCK_REPORTS: Report[] = [
    {
        _id: '1',
        reportedBy: { _id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'user', profileType: 'creator' },
        contentType: 'trailer',
        contentId: 't1',
        reason: 'spam',
        details: 'This is just a random advertisement video.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '2',
        reportedBy: { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', profileType: 'fan' },
        contentType: 'comment',
        contentId: 'c1',
        reason: 'harassment',
        details: 'Rude comment unrelated to the video.',
        status: 'reviewed',
        reviewedBy: 'admin1',
        reviewNotes: 'Warned user.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                if (USE_MOCK_DATA) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // Mock filtering and pagination logic
                    let filtered = MOCK_REPORTS;
                    if (statusFilter !== 'all') {
                        filtered = filtered.filter(r => r.status === statusFilter);
                    }

                    const start = (currentPage - 1) * ITEMS_PER_PAGE;
                    const end = start + ITEMS_PER_PAGE;
                    setReports(filtered.slice(start, end));
                    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
                } else {
                    const response = await reportsAPI.getAll({
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                        status: statusFilter !== 'all' ? statusFilter : undefined
                    });

                    if (response && Array.isArray(response.items)) {
                        setReports(response.items);
                        setTotalPages(response.totalPages || 1);
                    } else if (Array.isArray(response)) {
                        // Fallback
                        setReports(response);
                        setTotalPages(1);
                    } else {
                        console.error('Unexpected API response format:', response);
                        setReports([]);
                    }
                }
            } catch (err: any) {
                console.error('Failed to fetch reports:', err);
                setError(getErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [currentPage, statusFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of table
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStatusChange = (status: ReportStatus | 'all') => {
        setStatusFilter(status);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Content Reports
                        </h1>
                        <p className="text-gray-400">
                            Review and manage user reports on content.
                        </p>
                    </div>
                    <StatusFilter
                        currentStatus={statusFilter}
                        onStatusChange={handleStatusChange}
                    />
                </div>

                {error ? (
                    <ErrorDisplay
                        title="Failed to load reports"
                        message={error}
                    />
                ) : (
                    <>
                        <ReportsTable reports={reports} isLoading={isLoading} />
                        {!isLoading && !error && reports.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                        {!isLoading && !error && reports.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No reports found matching the selected filters.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
