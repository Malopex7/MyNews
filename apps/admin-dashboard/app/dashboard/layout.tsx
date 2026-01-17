'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Flag, Users, BarChart3, Shield, LogOut } from 'lucide-react';
import { ReactNode } from 'react';

interface NavItem {
    name: string;
    href: string;
    icon: any;
}

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Reports', href: '/dashboard/reports', icon: Flag },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Moderation', href: '/dashboard/moderation', icon: Shield },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-background-surface border-r border-background-highlight flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-background-highlight">
                    <h1 className="text-2xl font-bold text-primary">FanFlick</h1>
                    <p className="text-text-muted text-xs mt-1">Admin Dashboard</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:bg-background-highlight hover:text-text-primary'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-background-highlight">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                                {user?.username || 'Admin'}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center px-4 py-2 bg-background-highlight hover:bg-red-500/10 text-text-secondary hover:text-red-400 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
