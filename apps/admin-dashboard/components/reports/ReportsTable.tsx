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
            <div className="w-full bg-[#1c1c2e] rounded-xl shadow animate-pulse p-8 border border-[#2d2d42]">
                <div className="h-8 bg-[#2d2d42] rounded w-full mb-4"></div>
                <div className="h-20 bg-[#2d2d42] rounded w-full"></div>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="bg-[#1c1c2e] rounded-xl shadow p-12 text-center border border-[#2d2d42]">
                <p className="text-gray-300 text-lg font-medium">No reports found.</p>
                <p className="text-gray-500 text-sm mt-2">Good job keeping the platform clean!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-[#1c1c2e] rounded-xl shadow-xl border border-[#2d2d42]">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#13131f] text-gray-300 uppercase text-xs border-b border-[#2d2d42]">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Reason</th>
                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Details</th>
                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Reported By</th>
                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2d42]">
                    {reports.map((report) => (
                        <tr key={report._id} className="hover:bg-[#2d2d42]/30 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                                    ${report.contentType === 'trailer'
                                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                    {report.contentType}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap capitalize font-medium text-white group-hover:text-blue-100 transition-colors">
                                {report.reason}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate" title={report.details}>
                                {report.details || <span className="text-gray-600 italic">No details</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {typeof report.reportedBy === 'object' ? (
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{report.reportedBy.name}</span>
                                        <span className="text-gray-500 text-xs">{report.reportedBy.email}</span>
                                    </div>
                                ) : (
                                    report.reportedBy
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                {format(new Date(report.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize tracking-wide border
                                    ${report.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        report.status === 'actioned' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            report.status === 'dismissed' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                    href={`/dashboard/reports/${report._id}`}
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors py-1 px-3 rounded hover:bg-blue-500/10 inline-block"
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
