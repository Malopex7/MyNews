import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { CommentResponse } from '@packages/schemas';

interface CommentItemProps {
    comment: CommentResponse & { userId: { name: string; profile?: { avatar?: string } } };
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string) => void;
    isOwner?: boolean;
}

export default function CommentItem({ comment, onDelete, onEdit, isOwner }: CommentItemProps) {
    const handleDelete = () => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete?.(comment._id),
                },
            ]
        );
    };

    const getTypeBadge = () => {
        if (comment.type === 'critique') {
            return (
                <View className="bg-purple-500/20 px-2 py-1 rounded-md">
                    <Text className="text-purple-400 text-xs font-semibold">CRITIQUE</Text>
                </View>
            );
        }
        return (
            <View className="bg-gold/20 px-2 py-1 rounded-md">
                <Text className="text-gold text-xs font-semibold">HYPE</Text>
            </View>
        );
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <View className="bg-zinc-900/30 rounded-xl p-4 mb-3 border border-zinc-800">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className="text-white font-semibold">{comment.userId.name}</Text>
                    <Text className="text-zinc-500 text-xs">{formatTime(comment.createdAt)}</Text>
                </View>
                {getTypeBadge()}
            </View>

            {/* Comment Text */}
            <Text className="text-white text-base mb-2">{comment.text}</Text>

            {/* Actions (if owner) */}
            {isOwner && (
                <View className="flex-row space-x-3 mt-2">
                    <TouchableOpacity onPress={() => onEdit?.(comment._id)}>
                        <Text className="text-zinc-400 text-sm">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete}>
                        <Text className="text-red-500 text-sm">Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
