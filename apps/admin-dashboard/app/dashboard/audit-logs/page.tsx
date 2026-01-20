'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { AuditLogsTable } from '@/components/audit/AuditLogsTable';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { RefreshCw, Filter } from 'lucide-react';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [actionFilter, setActionFilter] = useState('');

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminAPI.getAuditLogs({
                page,
                limit: 20,
                action: actionFilter || undefined,
            });
            setLogs(data.items);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to load audit logs:', err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [page, actionFilter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Audit Logs</h1>
                    <p className="text-text-muted mt-1">Track administrative actions and system events</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center bg-background-surface p-4 rounded-xl border border-background-highlight">
                <Filter className="w-4 h-4 text-text-muted" />
                <select
                    value={actionFilter}
                    onChange={(e) => {
                        setActionFilter(e.target.value);
                        setPage(1);
                    }}
                    className="bg-transparent text-sm text-text-primary focus:outline-none border-none"
                >
                    <option value="">All Actions</option>
                    <option value="delete_comment">Delete Comment</option>
                    <option value="delete_media">Delete Media</option>
                    <option value="suspend_user">Suspend User</option>
                    <option value="unsuspend_user">Unsuspend User</option>
                </select>
            </div>

            {error ? (
                <ErrorDisplay
                    title="Failed to load audit logs"
                    message={error}
                    onRetry={fetchLogs}
                />
            ) : (
                <AuditLogsTable logs={logs} loading={loading} />
            )}

            {/* Pagination */}
            {!loading && total > 0 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 rounded-lg bg-background-surface border border-background-highlight disabled:opacity-50 hover:bg-background-highlight text-text-primary"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-text-muted">
                        Page {page}
                    </span>
                    <button
                        disabled={logs.length < 20}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 rounded-lg bg-background-surface border border-background-highlight disabled:opacity-50 hover:bg-background-highlight text-text-primary"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
