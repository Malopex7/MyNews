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
                <Filter className="h-5 w-5 text-text-secondary" />
                <select
                    value={currentStatus}
                    onChange={(e) => onStatusChange(e.target.value as ReportStatus | 'all')}
                    className="block w-full rounded-md border-border-default bg-background-surface py-2 pl-3 pr-10 text-text-primary focus:border-primary-default focus:outline-none focus:ring-1 focus:ring-primary-default sm:text-sm"
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
