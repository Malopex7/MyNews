'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from 'recharts';
import { ContentAnalytics } from '@/lib/types';

interface ContentCreationChartProps {
    data: ContentAnalytics | null;
    loading: boolean;
}

const COLORS = {
    original: { main: '#3B82F6', glow: '#3B82F640' },
    parody: { main: '#10B981', glow: '#10B98140' },
    remix: { main: '#8B5CF6', glow: '#8B5CF640' },
    response: { main: '#F59E0B', glow: '#F59E0B40' }
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
        return (
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                <p className="text-white text-sm font-semibold mb-3">{label}</p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-3 text-sm mb-1">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}
                        />
                        <span className="text-gray-300">{entry.name}:</span>
                        <span className="text-white font-medium">{entry.value}</span>
                    </div>
                ))}
                <div className="mt-3 pt-3 border-t border-[#2a2a4a]">
                    <p className="text-gray-400 text-sm">Total: <span className="text-white font-medium">{total}</span></p>
                </div>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ payload }: any) => {
    return (
        <div className="flex items-center justify-center gap-6 mt-4">
            {payload?.map((entry: any) => (
                <div key={entry.value} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}40` }}
                    />
                    <span className="text-gray-400 text-sm">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function ContentCreationChart({ data, loading }: ContentCreationChartProps) {
    if (loading) {
        return (
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6 h-[420px] flex items-center justify-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#2a2a4a] border-t-[#3B82F6] animate-spin" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6 h-[420px] flex items-center justify-center text-gray-500">
                No data available
            </div>
        );
    }

    return (
        <div className="bg-[#1c1c2e] border border-[#2d2d42] rounded-2xl p-6 shadow-xl h-full min-h-[420px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Content Creation</h3>
                    <p className="text-sm text-gray-500 mt-1">New trailers by type over the last {data.period} days</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-white">{data.summary.totalContent}</p>
                    <p className="text-sm text-emerald-400 font-medium">+{data.summary.averagePerDay}/day avg</p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                        <defs>
                            <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                            </linearGradient>
                            <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                                <stop offset="100%" stopColor="#10B981" stopOpacity={0.6} />
                            </linearGradient>
                            <linearGradient id="barGradientPurple" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
                            </linearGradient>
                            <linearGradient id="barGradientOrange" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#33334d" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="transparent"
                            tick={{ fill: '#6b7280', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis
                            stroke="transparent"
                            tick={{ fill: '#6b7280', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Legend content={<CustomLegend />} />
                        <Bar
                            dataKey="original"
                            name="Original"
                            stackId="a"
                            fill="url(#barGradientBlue)"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="parody"
                            name="Parody"
                            stackId="a"
                            fill="url(#barGradientGreen)"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="remix"
                            name="Remix"
                            stackId="a"
                            fill="url(#barGradientPurple)"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="response"
                            name="Response"
                            stackId="a"
                            fill="url(#barGradientOrange)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
