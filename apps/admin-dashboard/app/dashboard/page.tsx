'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Welcome back, {user?.username}!
                    </h1>
                    <p className="text-text-secondary">
                        Here's what's happening with FanFlick today.
                    </p>
                </div>

                {/* Metrics Grid - Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Users', value: '---', color: 'text-blue-400' },
                        { label: 'Pending Reports', value: '---', color: 'text-yellow-400' },
                        { label: 'Total Trailers', value: '---', color: 'text-green-400' },
                        { label: 'Active Creators', value: '---', color: 'text-purple-400' },
                    ].map((metric) => (
                        <div
                            key={metric.label}
                            className="bg-background-surface border border-background-highlight rounded-lg p-6"
                        >
                            <p className="text-text-muted text-sm mb-2">{metric.label}</p>
                            <p className={`text-3xl font-bold ${metric.color}`}>
                                {metric.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Message */}
                <div className="bg-background-surface border border-background-highlight rounded-lg p-8 text-center">
                    <h2 className="text-xl font-bold text-text-primary mb-2">
                        Dashboard Analytics Coming Soon
                    </h2>
                    <p className="text-text-secondary">
                        Charts, recent activity, and detailed metrics will be added in Phase 4.
                    </p>
                </div>
            </div>
        </div>
    );
}
