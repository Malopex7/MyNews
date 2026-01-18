'use client';

import { ReactNode } from 'react';

interface MetricsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    color?: 'blue' | 'yellow' | 'green' | 'purple' | 'red' | 'orange';
    loading?: boolean;
}

const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

const iconColorClasses = {
    blue: 'text-blue-400 bg-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    red: 'text-red-400 bg-red-500/20',
    orange: 'text-orange-400 bg-orange-500/20',
};

export default function MetricsCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = 'blue',
    loading = false,
}: MetricsCardProps) {
    return (
        <div className={`bg-background-surface border rounded-lg p-6 ${colorClasses[color]}`}>
            <div className="flex items-start justify-between mb-4">
                <p className="text-text-muted text-sm font-medium">{title}</p>
                {icon && (
                    <div className={`p-2 rounded-lg ${iconColorClasses[color]}`}>
                        {icon}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="animate-pulse">
                    <div className="h-8 bg-background-highlight rounded w-24 mb-2"></div>
                    <div className="h-4 bg-background-highlight rounded w-32"></div>
                </div>
            ) : (
                <>
                    <p className={`text-3xl font-bold mb-1 ${color ? `text-${color}-400` : 'text-text-primary'}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>

                    {subtitle && (
                        <p className="text-text-muted text-sm">{subtitle}</p>
                    )}

                    {trend && (
                        <div className="flex items-center mt-2 text-sm">
                            <span className={trend.positive ? 'text-green-400' : 'text-red-400'}>
                                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-text-muted ml-1">{trend.label}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
