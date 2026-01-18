'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { ReportAnalytics, ReportReason } from '@/lib/types';

interface ReportVolumeChartProps {
    data: ReportAnalytics | null;
    loading: boolean;
}

const COLORS = {
    inappropriate: '#EF4444', // Red
    spam: '#F59E0B',          // Yellow
    copyright: '#8B5CF6',     // Purple
    harassment: '#3B82F6',    // Blue
    other: '#9CA3AF',         // Gray
};

const LABELS: Record<ReportReason, string> = {
    inappropriate: 'Inappropriate',
    spam: 'Spam',
    copyright: 'Copyright',
    harassment: 'Harassment',
    other: 'Other'
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background-surface border border-background-highlight p-3 rounded-lg shadow-lg">
                <p className="text-text-primary text-sm font-bold mb-1">{payload[0].name}</p>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>{payload[0].value} reports</span>
                    <span className="text-text-muted">
                        ({(payload[0].percent * 100).toFixed(1)}%)
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export default function ReportVolumeChart({ data, loading }: ReportVolumeChartProps) {
    if (loading) {
        return (
            <div className="bg-background-surface border border-background-highlight rounded-lg p-6 h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-background-surface border border-background-highlight rounded-lg p-6 h-[400px] flex items-center justify-center text-text-secondary">
                No data available
            </div>
        );
    }

    const chartData = data.byReason.map(item => ({
        name: LABELS[item._id] || item._id,
        value: item.count,
        color: COLORS[item._id] || COLORS.other
    })).sort((a, b) => b.value - a.value);

    return (
        <div className="bg-background-surface border border-background-highlight rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">Reports by Reason</h3>
                    <p className="text-sm text-text-secondary">Distribution over the last {data.period} days</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-text-primary">{data.summary.totalReports}</p>
                    <p className="text-xs text-yellow-500">
                        {(data.summary.resolutionRate * 100).toFixed(1)}% resolved
                    </p>
                </div>
            </div>

            <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            wrapperStyle={{ paddingLeft: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
