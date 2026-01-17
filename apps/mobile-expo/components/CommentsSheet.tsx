import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import type { CommentType } from '@packages/schemas';
import { commentsApi } from '../services/api';

interface CommentsSheetProps {
    visible: boolean;
    onClose: () => void;
    mediaId: string;
    currentUserId?: string;
}

export default function CommentsSheet({ visible, onClose, mediaId, currentUserId }: CommentsSheetProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await commentsApi.getCommentsByMedia(mediaId);
            setComments(data.comments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchComments();
        }
    }, [visible, mediaId]);

    const handleSubmit = async (text: string, type: CommentType) => {
        try {
            const newComment = await commentsApi.createComment({
                mediaId,
                text,
                type,
            });
            setComments((prev) => [newComment, ...prev]);
        } catch (error) {
            console.error('Failed to create comment:', error);
            throw error;
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await commentsApi.deleteComment(commentId);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 bg-black/80 justify-end">
                    <View className="bg-zinc-950 rounded-t-3xl max-h-[85%] flex-1">
                        {/* Header */}
                        <View className="flex-row justify-between items-center p-4 border-b border-zinc-800">
                            <Text className="text-white text-xl font-bold">Comments</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text className="text-gold text-lg font-bold">✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Comments List */}
                        <CommentList
                            comments={comments}
                            loading={loading}
                            onRefresh={fetchComments}
                            onDelete={handleDelete}
                            currentUserId={currentUserId}
                        />

                        {/* Comment Input */}
                        <CommentInput onSubmit={handleSubmit} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
