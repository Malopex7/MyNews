'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { ReportAnalytics, ReportReason } from '@/lib/types';

interface ReportVolumeChartProps {
    data: ReportAnalytics | null;
    loading: boolean;
}

const COLORS: Record<ReportReason, { main: string; glow: string }> = {
    inappropriate: { main: '#EF4444', glow: '#EF444450' },
    spam: { main: '#F59E0B', glow: '#F59E0B50' },
    copyright: { main: '#8B5CF6', glow: '#8B5CF650' },
    harassment: { main: '#3B82F6', glow: '#3B82F650' },
    other: { main: '#6B7280', glow: '#6B728050' },
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
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: payload[0].payload.color, boxShadow: `0 0 10px ${payload[0].payload.color}` }}
                    />
                    <p className="text-white text-sm font-semibold">{payload[0].name}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-300">{payload[0].value} reports</span>
                    <span className="text-gray-500">
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
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6 h-[380px] flex items-center justify-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#2a2a4a] border-t-[#8B5CF6] animate-spin" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6 h-[380px] flex items-center justify-center text-gray-500">
                No data available
            </div>
        );
    }

    const chartData = data.byReason.map(item => ({
        name: LABELS[item._id] || item._id,
        value: item.count,
        color: COLORS[item._id]?.main || COLORS.other.main
    })).sort((a, b) => b.value - a.value);

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-[#1c1c2e] border border-[#2d2d42] rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between min-h-[420px]">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Reports by Reason</h3>
                    <p className="text-sm text-gray-500 mt-1">Distribution over the last {data.period} days</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-white">{data.summary.totalReports}</p>
                    <p className="text-sm text-amber-400 font-medium">
                        {(data.summary.resolutionRate * 100).toFixed(1)}% resolved
                    </p>
                </div>
            </div>

            <div className="h-[240px] w-full relative flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            {chartData.map((entry, index) => (
                                <filter key={`glow-${index}`} id={`glow-${index}`}>
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            ))}
                        </defs>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="none"
                                    style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center stat */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{total}</p>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
                {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}60` }}
                        />
                        <span className="text-gray-400 text-xs truncate">{entry.name}</span>
                        <span className="text-gray-600 text-xs ml-auto">{entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
