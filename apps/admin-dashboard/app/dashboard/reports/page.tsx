'use client';

import { useEffect, useState } from 'react';
import { reportsAPI } from '@/lib/api';
import { Report } from '@/lib/types';
import ReportsTable from '@/components/reports/ReportsTable';

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

    useEffect(() => {
        const fetchReports = async () => {
            try {
                if (USE_MOCK_DATA) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setReports(MOCK_REPORTS);
                } else {
                    const response = await reportsAPI.getAll();
                    // Handle paginated response
                    if (response && Array.isArray(response.items)) {
                        setReports(response.items);
                    } else if (Array.isArray(response)) {
                        // Fallback in case API changes to return array directly
                        setReports(response);
                    } else {
                        console.error('Unexpected API response format:', response);
                        setReports([]);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch reports:', err);
                setError('Failed to load reports. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

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
                    <ReportsTable reports={reports} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
}
