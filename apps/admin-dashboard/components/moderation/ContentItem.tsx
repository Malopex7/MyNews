import { Trash2, Video, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface ContentItemProps {
    item: any;
    onDelete: (id: string, type: 'video' | 'comment') => void;
}

export function ContentItem({ item, onDelete }: ContentItemProps) {
    const isVideo = item.entityType === 'video';
    const typeColor = isVideo ? 'text-blue-400 bg-blue-400/10' : 'text-green-400 bg-green-400/10';
    const TypeIcon = isVideo ? Video : MessageSquare;

    // Helper for formatting dates safely
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return 'Unknown date';
        }
    };

    return (
        <div className="bg-background-surface rounded-xl border border-background-highlight p-4 flex items-start gap-4 transition-colors hover:border-primary/30">
            {/* Type Indicator */}
            <div className={`p-2 rounded-lg ${typeColor}`}>
                <TypeIcon className="w-5 h-5" />
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-muted">
                        {isVideo ? 'VIDEO' : 'COMMENT'} • {formatDate(item.createdAt)}
                    </span>
                    <span className="text-xs text-text-muted">
                        ID: {item._id}
                    </span>
                </div>

                <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">
                    {item.title || 'Untitled'}
                </h3>

                <p className="text-sm text-text-secondary line-clamp-2 md:line-clamp-none">
                    {item.content || item.description || 'No content'}
                </p>

                {/* Author Info */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-background-highlight overflow-hidden relative">
                        {item.originalAuthor?.profile?.avatar?.url ? (
                            <Image
                                src={item.originalAuthor.profile.avatar.url}
                                alt={item.originalAuthor.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/20" />
                        )}
                    </div>
                    <span className="text-xs text-text-muted">
                        by <span className="text-text-primary">{item.originalAuthor?.name || 'Unknown User'}</span>
                    </span>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={() => onDelete(item._id, item.entityType)}
                className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Delete content"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
