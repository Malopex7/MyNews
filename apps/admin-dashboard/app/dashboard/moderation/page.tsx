'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { adminAPI, mediaAPI, commentsAPI } from '@/lib/api';
import { ContentItem } from '@/components/moderation/ContentItem';

export default function ModerationPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [type, setType] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchContent();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, type, page]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getContent({
                page,
                limit: 20,
                type,
                search,
                sort: 'newest'
            });

            // Normalize data structure if needed directly from API
            // The API response items should already match what ContentItem expects roughly
            // but let's ensure author mapping matches the component expecting 'originalAuthor' or 'author'
            const normalizedItems = data.items.map((item: any) => ({
                ...item,
                originalAuthor: item.author // Remapping for component consistency
            }));

            setItems(normalizedItems);
            setTotal(data.total);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, entityType: 'video' | 'comment') => {
        if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) return;

        try {
            if (entityType === 'video') {
                await mediaAPI.delete(id);
            } else {
                await commentsAPI.delete(id);
            }

            // Refresh list
            fetchContent();
        } catch (err) {
            alert('Failed to delete content');
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Content Moderation</h1>
                    <p className="text-text-muted mt-1">Browse and manage platform content</p>
                </div>
                <button
                    onClick={fetchContent}
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex bg-background-surface p-1 rounded-lg border border-background-highlight self-start">
                    {['all', 'video', 'comment'].map((t) => (
                        <button
                            key={t}
                            onClick={() => { setType(t); setPage(1); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${type === t
                                    ? 'bg-background-highlight text-text-primary shadow-sm'
                                    : 'text-text-muted hover:text-text-primary'
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}s
                        </button>
                    ))}
                </div>

                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search content..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-background-surface border border-background-highlight rounded-lg pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:border-primary/50"
                    />
                </div>
            </div>

            {/* Content List */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-text-muted bg-background-surface rounded-xl border border-background-highlight">
                    No content found matching your filters.
                </div>
            ) : (
                <div className="grid gap-4">
                    {items.map((item) => (
                        <ContentItem
                            key={item._id}
                            item={item}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Pagination helper */}
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
                        onClick={() => setPage(p => p + 1)}
                        // Simple check, implies backend returns correct total
                        disabled={items.length < 20}
                        className="px-4 py-2 rounded-lg bg-background-surface border border-background-highlight disabled:opacity-50 hover:bg-background-highlight text-text-primary"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
