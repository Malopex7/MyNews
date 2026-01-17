'use client';

import { useEffect, useState } from 'react';
import { reportsAPI } from '@/lib/api';
import { Report } from '@/lib/types';
import ReportsTable from '@/components/reports/ReportsTable';
import Pagination from '@/components/common/Pagination';

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
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                if (USE_MOCK_DATA) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // Mock pagination logic
                    const start = (currentPage - 1) * ITEMS_PER_PAGE;
                    const end = start + ITEMS_PER_PAGE;
                    setReports(MOCK_REPORTS.slice(start, end));
                    setTotalPages(Math.ceil(MOCK_REPORTS.length / ITEMS_PER_PAGE));
                } else {
                    const response = await reportsAPI.getAll({
                        page: currentPage,
                        limit: ITEMS_PER_PAGE
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
                const status = err.response?.status;
                const message = err.response?.data?.message || err.message;

                if (status === 403) {
                    setError('Access denied. You do not have admin permissions.');
                } else if (status === 401) {
                    setError('Session expired. Please log in again.');
                } else {
                    setError(`Failed to load reports: ${message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of table
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Content Reports
                    </h1>
                    <p className="text-text-secondary">
                        Review and manage user reports on content.
                    </p>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
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
                    </>
                )}
            </div>
        </div>
    );
}
