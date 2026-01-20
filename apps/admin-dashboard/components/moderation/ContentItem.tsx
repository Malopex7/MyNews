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
        <div className="bg-[#1c1c2e] rounded-xl border border-[#2d2d42] p-4 flex items-start gap-4 transition-colors hover:border-blue-500/30 shadow-md">
            {/* Type Indicator */}
            <div className={`p-2 rounded-lg ${typeColor}`}>
                <TypeIcon className="w-5 h-5" />
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-400">
                        {isVideo ? 'VIDEO' : 'COMMENT'} • {formatDate(item.createdAt)}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                        ID: {item._id}
                    </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1 truncate">
                    {item.title || 'Untitled'}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-none">
                    {item.content || item.description || 'No content'}
                </p>

                {/* Author Info */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#2d2d42] overflow-hidden relative border border-white/10">
                        {item.originalAuthor?.profile?.avatar?.url ? (
                            <Image
                                src={item.originalAuthor.profile.avatar.url}
                                alt={item.originalAuthor.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                                {(item.originalAuthor?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <span className="text-xs text-gray-500">
                        by <span className="text-gray-300 font-medium">{item.originalAuthor?.name || 'Unknown User'}</span>
                    </span>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={() => onDelete(item._id, item.entityType)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete content"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
