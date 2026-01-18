import { format } from 'date-fns';

interface AuditLog {
    _id: string;
    createdAt: string;
    adminId: {
        _id: string;
        name: string;
        email: string;
    };
    action: string;
    targetType: string;
    targetId: string;
    details?: any;
    ipAddress?: string;
}

interface AuditLogsTableProps {
    logs: AuditLog[];
    loading: boolean;
}

export function AuditLogsTable({ logs, loading }: AuditLogsTableProps) {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="w-full p-8 text-center bg-background-surface rounded-xl border border-background-highlight text-text-muted">
                No audit logs found.
            </div>
        );
    }

    return (
        <div className="bg-background-surface rounded-xl border border-background-highlight overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-background-highlight bg-background-highlight/50">
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Date / Time
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Admin
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Action
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Target
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background-highlight">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-background-highlight/30 transition-colors">
                                <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                                    <div className="font-medium text-text-primary">
                                        {format(new Date(log.createdAt), 'MMM d, yyyy')}
                                    </div>
                                    <div className="text-xs text-text-muted">
                                        {format(new Date(log.createdAt), 'h:mm a')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                    <div className="font-medium text-text-primary">
                                        {log.adminId?.name || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-text-muted">
                                        {log.adminId?.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase">
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                                    <div className="capitalize font-medium">{log.targetType}</div>
                                    {log.targetId && (
                                        <div className="text-xs text-text-muted font-mono">{log.targetId}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-text-muted">
                                    <pre className="text-xs bg-background-highlight/50 p-2 rounded max-w-xs overflow-x-auto">
                                        {JSON.stringify(log.details || {}, null, 2)}
                                    </pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
