'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { UserAnalytics } from '@/lib/types';

interface UserGrowthChartProps {
    data: UserAnalytics | null;
    loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background-surface border border-background-highlight p-3 rounded-lg shadow-lg">
                <p className="text-text-primary text-sm font-bold mb-2">{label}</p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm text-text-secondary">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.name}: {entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function UserGrowthChart({ data, loading }: UserGrowthChartProps) {
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

    return (
        <div className="bg-background-surface border border-background-highlight rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">User Growth</h3>
                    <p className="text-sm text-text-secondary">New registrations over the last {data.period} days</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-text-primary">{data.summary.totalNewUsers}</p>
                    <p className="text-xs text-green-400">+{data.summary.averagePerDay}/day avg</p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 12 }}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            name="Total New Users"
                            stroke="#60A5FA"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="creators"
                            name="Creators"
                            stroke="#C084FC"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="viewers"
                            name="Viewers"
                            stroke="#4ADE80"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
