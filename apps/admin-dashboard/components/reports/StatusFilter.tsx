'use client';

import { ReportStatus } from '@/lib/types';
import { Filter } from 'lucide-react';

interface StatusFilterProps {
    currentStatus: ReportStatus | 'all';
    onStatusChange: (status: ReportStatus | 'all') => void;
}

export default function StatusFilter({ currentStatus, onStatusChange }: StatusFilterProps) {
    const statuses: { value: ReportStatus | 'all'; label: string }[] = [
        { value: 'all', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'actioned', label: 'Actioned' },
        { value: 'dismissed', label: 'Dismissed' },
    ];

    return (
        <div className="relative inline-block text-left">
            <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                    value={currentStatus}
                    onChange={(e) => onStatusChange(e.target.value as ReportStatus | 'all')}
                    className="block w-full rounded-lg border-[#2d2d42] bg-[#1c1c2e] py-2 pl-3 pr-10 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm cursor-pointer shadow-sm transition-all border"
                >
                    {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
