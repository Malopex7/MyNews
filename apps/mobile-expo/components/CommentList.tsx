import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import CommentItem from './CommentItem';
import type { CommentResponse, CommentType } from '@packages/schemas';

interface CommentListProps {
    comments: (CommentResponse & { userId: { name: string; profile?: { avatar?: string } } })[];
    loading?: boolean;
    onRefresh?: () => Promise<void>;
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string) => void;
    currentUserId?: string;
}

type FilterType = 'all' | CommentType;

export default function CommentList({
    comments,
    loading,
    onRefresh,
    onDelete,
    onEdit,
    currentUserId,
}: CommentListProps) {
    const [filter, setFilter] = useState<FilterType>('all');
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (!onRefresh) return;
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
    };

    const filteredComments = comments.filter((comment) => {
        if (filter === 'all') return true;
        return comment.type === filter;
    });

    const getFilterButton = (type: FilterType, label: string, color: string) => {
        const isActive = filter === type;
        return (
            <TouchableOpacity
                onPress={() => setFilter(type)}
                className={`px-4 py-2 rounded-full border ${isActive
                        ? `bg-${color}/20 border-${color}`
                        : 'bg-zinc-800/50 border-zinc-700'
                    }`}
            >
                <Text
                    className={`font-semibold ${isActive ? `text-${color}` : 'text-zinc-400'
                        }`}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    if (loading && comments.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-8">
                <ActivityIndicator size="large" color="#f59e0b" />
            </View>
        );
    }

    return (
        <View className="flex-1">
            {/* Filter Tabs */}
            <View className="flex-row gap-2 p-4 border-b border-zinc-800">
                {getFilterButton('all', 'All', 'white')}
                {getFilterButton('critique', '💡 Critique', 'purple-400')}
                {getFilterButton('hype', '🔥 Hype', 'gold')}
            </View>

            {/* Comments List */}
            <FlatList
                data={filteredComments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <CommentItem
                        comment={item}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        isOwner={currentUserId === (typeof item.userId === 'string' ? item.userId : item.userId._id)}
                    />
                )}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#f59e0b"
                        />
                    ) : undefined
                }
                ListEmptyComponent={
                    <View className="items-center justify-center py-12">
                        <Text className="text-zinc-500 text-center">
                            {filter === 'all'
                                ? 'No comments yet.\nBe the first to comment!'
                                : `No ${filter} comments yet.`}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
