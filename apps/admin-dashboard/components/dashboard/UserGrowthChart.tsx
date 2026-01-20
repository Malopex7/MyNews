'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    AreaChart
} from 'recharts';
import { UserAnalytics } from '@/lib/types';

interface UserGrowthChartProps {
    data: UserAnalytics | null;
    loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                <p className="text-white text-sm font-semibold mb-3">{label}</p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-3 text-sm mb-1">
                        <div
                            className="w-2.5 h-2.5 rounded-full shadow-lg"
                            style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}
                        />
                        <span className="text-gray-300">{entry.name}:</span>
                        <span className="text-white font-medium">{entry.value}</span>
                    </div>
                ))}
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
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}40` }}
                    />
                    <span className="text-gray-400 text-sm">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function UserGrowthChart({ data, loading }: UserGrowthChartProps) {
    if (loading) {
        return (
            <div className="bg-[#0d0d14] border border-[#1a1a2e] rounded-2xl p-6 h-[420px] flex items-center justify-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#2a2a4a] border-t-[#60A5FA] animate-spin" />
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
                    <h3 className="text-xl font-bold text-white">User Growth</h3>
                    <p className="text-sm text-gray-500 mt-1">New registrations over the last {data.period} days</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-white">{data.summary.totalNewUsers}</p>
                    <p className="text-sm text-emerald-400 font-medium">+{data.summary.averagePerDay}/day avg</p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                        <defs>
                            <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C084FC" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#C084FC" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
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
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            name="Total New Users"
                            stroke="#60A5FA"
                            strokeWidth={2.5}
                            fill="url(#gradientBlue)"
                            dot={false}
                            activeDot={{ r: 5, fill: '#60A5FA', stroke: '#0d0d14', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="creators"
                            name="Creators"
                            stroke="#C084FC"
                            strokeWidth={2}
                            fill="url(#gradientPurple)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#C084FC', stroke: '#0d0d14', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="viewers"
                            name="Viewers"
                            stroke="#4ADE80"
                            strokeWidth={2}
                            fill="url(#gradientGreen)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#4ADE80', stroke: '#0d0d14', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
