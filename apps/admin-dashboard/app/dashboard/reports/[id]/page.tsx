'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { reportsAPI } from '@/lib/api';
import { Report, ReportStatus, User } from '@/lib/types';
import { ArrowLeft, User as UserIcon, Calendar, MessageSquare, Video, ShieldAlert, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Notes state
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                // Simulate delay/mock if needed, similar to list page
                // But for now, let's try real API
                const data = await reportsAPI.getById(id);
                setReport(data);
                if (data.reviewNotes) {
                    setNotes(data.reviewNotes);
                }
            } catch (err: any) {
                console.error('Failed to fetch report:', err);
                const status = err.response?.status;
                const message = err.response?.data?.message || err.message;

                if (status === 403) {
                    setError('Access denied. You do not have admin permissions.');
                } else if (status === 401) {
                    setError('Session expired. Please log in again.');
                } else {
                    setError(`Failed to load report: ${message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const handleStatusUpdate = async (newStatus: ReportStatus) => {
        if (!report) return;

        try {
            setIsUpdating(true);
            await reportsAPI.update(report._id, {
                status: newStatus,
                reviewNotes: notes
            });

            // Optimistic update or refetch
            setReport(prev => prev ? { ...prev, status: newStatus, reviewNotes: notes } : null);
            // Optionally show toast
        } catch (err: any) {
            console.error('Failed to update report:', err);
            alert('Failed to update status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-background-highlight rounded w-1/4"></div>
                    <div className="h-64 bg-background-surface rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <Link href="/dashboard/reports" className="flex items-center text-text-secondary hover:text-text-primary mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reports
                </Link>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center">
                    <ShieldAlert className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-bold mb-2">Error Loading Report</h3>
                    <p>{error || 'Report not found'}</p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            actioned: 'bg-green-100 text-green-800',
            dismissed: 'bg-gray-100 text-gray-800',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    const reporter = report.reportedBy as User; // Assuming populated

    return (
        <div className="p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/reports" className="p-2 hover:bg-background-highlight rounded-full transition-colors text-text-secondary">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                                Report Details
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase ${getStatusBadge(report.status)}`}>
                                    {report.status}
                                </span>
                            </h1>
                            <div className="flex items-center text-sm text-text-secondary mt-1 gap-4">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-text-muted">ID: {report._id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {report.status === 'pending' && (
                            <button
                                onClick={() => handleStatusUpdate('reviewed')}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium text-sm transition-colors"
                            >
                                Mark as Reviewed
                            </button>
                        )}
                        {(report.status === 'pending' || report.status === 'reviewed') && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate('dismissed')}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-background-paper border border-border-default text-text-primary rounded-md hover:bg-background-highlight disabled:opacity-50 font-medium text-sm transition-colors flex items-center gap-2"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('actioned')}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 font-medium text-sm transition-colors flex items-center gap-2"
                                >
                                    <ShieldAlert className="h-4 w-4" />
                                    Take Action
                                </button>
                            </>
                        )}
                        {(report.status === 'dismissed' || report.status === 'actioned') && (
                            <button
                                onClick={() => handleStatusUpdate('pending')}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-background-paper border border-border-default text-text-secondary rounded-md hover:bg-background-highlight disabled:opacity-50 font-medium text-sm transition-colors"
                            >
                                Reopen Report
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Report Reason & Description */}
                        <div className="bg-background-surface rounded-lg border border-border-default p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-red-500" />
                                Reason: <span className="capitalize">{report.reason}</span>
                            </h2>
                            <div className="bg-background-paper p-4 rounded-md border border-border-default">
                                <p className="text-text-secondary whitespace-pre-wrap">{report.details || "No additional details provided."}</p>
                            </div>
                        </div>

                        {/* Reported Content Preview */}
                        <div className="bg-background-surface rounded-lg border border-border-default p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                {report.contentType === 'trailer' ? <Video className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                                Content Preview
                            </h2>

                            <div className="bg-background-paper rounded-md border border-border-default overflow-hidden">
                                {!report.content ? (
                                    <div className="p-8 text-center text-text-secondary">
                                        <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-50 text-red-500" />
                                        <p>Content not found.</p>
                                        <p className="text-xs mt-1">It may have been deleted already.</p>
                                        <p className="text-xs text-text-muted mt-2 font-mono">ID: {report.contentId}</p>
                                    </div>
                                ) : report.contentType === 'trailer' ? (
                                    <div>
                                        {/* Video Player / Thumbnail */}
                                        <div className="aspect-video bg-black flex items-center justify-center text-gray-500 relative group">
                                            {/* In a real app, we would use a video player here with valid URL 
                                                e.g. <video src={`/api/media/stream/${report.contentId}`} controls ... />
                                                For now, we'll simulate a video preview state
                                            */}
                                            <Video className="h-12 w-12 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm font-medium border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                                    Preview Unavailable (Stream API Pending)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-text-primary text-lg">{report.content.title || 'Untitled'}</h3>
                                            <p className="text-text-secondary text-sm mt-1 mb-3 line-clamp-3">{report.content.description}</p>

                                            <div className="flex items-center gap-4 text-xs text-text-muted border-t border-border-default pt-3">
                                                <span>Genre: {report.content.genre}</span>
                                                <span>•</span>
                                                <span>Views: {report.content.metrics?.views || 0}</span>
                                                <span>•</span>
                                                <span className="font-mono">ID: {report.content._id}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="h-8 w-8 rounded-full bg-primary-default/20 flex items-center justify-center text-xs font-bold text-primary-default shrink-0">
                                                {(report.content.userId?.username || 'U')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-primary">
                                                    @{report.content.userId?.username || 'unknown'}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    Posted {new Date(report.content.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pl-11">
                                            <p className="text-text-primary text-base whitespace-pre-wrap border-l-2 border-border-default pl-3 py-1">
                                                {report.content.text}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-border-default flex justify-between text-xs text-text-muted">
                                            <span className="capitalize badge bg-gray-100 px-2 py-0.5 rounded text-gray-700">Type: {report.content.type}</span>
                                            <span className="font-mono">ID: {report.content._id}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-background-surface rounded-lg border border-border-default p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">Internal Review Notes</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about your decision..."
                                className="w-full bg-background-paper border border-border-default rounded-md p-3 text-text-primary h-32 focus:ring-1 focus:ring-primary-default focus:border-primary-default resize-none"
                            />
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => handleStatusUpdate(report.status)} // Just save notes
                                    disabled={isUpdating}
                                    className="text-sm font-medium text-primary-default hover:text-primary-hover disabled:opacity-50"
                                >
                                    Save Notes Only
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Metadata */}
                    <div className="space-y-6">
                        {/* Reporter Info */}
                        <div className="bg-background-surface rounded-lg border border-border-default p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Reporter
                            </h2>
                            {typeof report.reportedBy === 'object' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary-default/10 flex items-center justify-center text-primary-default font-bold">
                                            {(report.reportedBy.name || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary">{report.reportedBy.name}</p>
                                            <p className="text-xs text-text-secondary capitalize">{report.reportedBy.role} • {report.reportedBy.profileType}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-border-default text-sm">
                                        <p className="text-text-secondary mb-1">Email</p>
                                        <p className="text-text-primary font-medium">{report.reportedBy.email}</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-text-secondary mb-1">User ID</p>
                                        <p className="font-mono text-xs text-text-muted bg-background-paper p-1 rounded inline-block">{report.reportedBy._id}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-text-secondary">User ID: {report.reportedBy}</p>
                            )}
                        </div>

                        {/* Reviewer Info (if reviewed) */}
                        {report.reviewedBy && (
                            <div className="bg-background-surface rounded-lg border border-border-default p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Reviewed By
                                </h2>
                                <p className="text-text-primary font-medium">
                                    {typeof report.reviewedBy === 'object' ? report.reviewedBy.email : 'Admin'}
                                </p>
                                <p className="text-xs text-text-secondary mt-1">
                                    Last Updated: {new Date(report.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
