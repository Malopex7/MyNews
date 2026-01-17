'use client';

import { Report } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';

interface ReportsTableProps {
    reports: Report[];
    isLoading: boolean;
}

export default function ReportsTable({ reports, isLoading }: ReportsTableProps) {
    if (isLoading) {
        return (
            <div className="w-full bg-background-surface rounded-lg shadow animate-pulse p-8">
                <div className="h-8 bg-background-highlight rounded w-full mb-4"></div>
                <div className="h-20 bg-background-highlight rounded w-full"></div>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="bg-background-surface rounded-lg shadow p-8 text-center bg-background-paper border border-border-default">
                <p className="text-text-secondary text-lg">No reports found.</p>
                <p className="text-text-muted text-sm mt-2">Good job keeping the platform clean!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-background-surface rounded-lg shadow border border-border-default">
            <table className="w-full text-left text-sm text-text-secondary">
                <thead className="bg-background-highlight text-text-primary uppercase text-xs">
                    <tr>
                        <th scope="col" className="px-6 py-3 font-semibold">Type</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Reason</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Details</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Reported By</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                    {reports.map((report) => (
                        <tr key={report._id} className="hover:bg-background-highlight transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${report.contentType === 'trailer' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {report.contentType}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap capitalize font-medium text-text-primary">
                                {report.reason}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate" title={report.details}>
                                {report.details || <span className="text-text-muted italic">No details</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {typeof report.reportedBy === 'object' ? (
                                    <div className="flex flex-col">
                                        <span className="text-text-primary">{report.reportedBy.name}</span>
                                        <span className="text-text-muted text-xs">{report.reportedBy.email}</span>
                                    </div>
                                ) : (
                                    report.reportedBy
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-text-muted">
                                {format(new Date(report.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize tracking-wide border
                                    ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                        report.status === 'actioned' ? 'bg-red-100 text-red-800 border-red-200' :
                                            report.status === 'dismissed' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                                'bg-blue-100 text-blue-800 border-blue-200'}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                    href={`/dashboard/reports/${report._id}`}
                                    className="text-primary-default hover:text-primary-hover font-medium transition-colors"
                                >
                                    Review
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
