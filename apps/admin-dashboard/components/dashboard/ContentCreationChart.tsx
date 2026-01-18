'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { ContentAnalytics } from '@/lib/types';

interface ContentCreationChartProps {
    data: ContentAnalytics | null;
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
                <div className="mt-2 pt-2 border-t border-background-highlight">
                    <p className="text-xs text-text-secondary">Total: {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)}</p>
                </div>
            </div>
        );
    }
    return null;
};

export default function ContentCreationChart({ data, loading }: ContentCreationChartProps) {
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
                    <h3 className="text-lg font-bold text-text-primary">Content Creation</h3>
                    <p className="text-sm text-text-secondary">New trailers by type over the last {data.period} days</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-text-primary">{data.summary.totalContent}</p>
                    <p className="text-xs text-green-400">+{data.summary.averagePerDay}/day avg</p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
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
                        <Bar dataKey="original" name="Original" stackId="a" fill="#3B82F6" />
                        <Bar dataKey="parody" name="Parody" stackId="a" fill="#10B981" />
                        <Bar dataKey="remix" name="Remix" stackId="a" fill="#8B5CF6" />
                        <Bar dataKey="response" name="Response" stackId="a" fill="#F59E0B" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
