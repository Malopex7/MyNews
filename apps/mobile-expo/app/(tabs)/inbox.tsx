import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../state/authStore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'response';
    actor: {
        id: string;
        username: string;
    };
    targetMedia: {
        id: string;
        title: string;
    };
    read: boolean;
    createdAt: string;
}

export default function InboxScreen() {
    const router = useRouter();
    const accessToken = useAuthStore((state: any) => state.accessToken);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setNotifications(data.items || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications();
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationPress = async (notification: Notification) => {
        // Mark as read
        try {
            await fetch(`http://localhost:3001/api/notifications/${notification.id}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }

        // Navigate based on type
        if (notification.type === 'like' || notification.type === 'comment') {
            // Navigate to feed and play the trailer
            router.push(`/(tabs)/feed?mediaId=${notification.targetMedia.id}`);
        } else if (notification.type === 'response') {
            // Navigate to the response trailer
            router.push(`/(tabs)/feed?mediaId=${notification.targetMedia.id}`);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like':
                return 'heart';
            case 'comment':
                return 'chatbubble';
            case 'response':
                return 'git-branch';
            default:
                return 'notifications';
        }
    };

    const getNotificationMessage = (notification: Notification) => {
        switch (notification.type) {
            case 'like':
                return `@${notification.actor.username} liked your trailer "${notification.targetMedia.title}"`;
            case 'comment':
                return `@${notification.actor.username} commented on your trailer "${notification.targetMedia.title}"`;
            case 'response':
                return `@${notification.actor.username} created a response to your trailer "${notification.targetMedia.title}"`;
            default:
                return 'New notification';
        }
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now.getTime() - past.getTime();
        const diffInMinutes = Math.floor(diffInMs / 60000);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <StyledTouchableOpacity
            onPress={() => handleNotificationPress(item)}
            className={`flex-row p-4 border-b border-gray-800 ${!item.read ? 'bg-surface' : 'bg-background'}`}
        >
            <StyledView className="mr-3 mt-1">
                <Ionicons name={getNotificationIcon(item.type) as any} size={24} color="#EAB308" />
            </StyledView>
            <StyledView className="flex-1">
                <StyledText className="text-white text-sm mb-1">
                    {getNotificationMessage(item)}
                </StyledText>
                <StyledText className="text-text-secondary text-xs">
                    {getTimeAgo(item.createdAt)}
                </StyledText>
            </StyledView>
            {!item.read && (
                <StyledView className="w-2 h-2 rounded-full bg-primary mt-2" />
            )}
        </StyledTouchableOpacity>
    );

    if (loading) {
        return (
            <StyledView className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#EAB308" />
            </StyledView>
        );
    }

    return (
        <StyledView className="flex-1 bg-background">
            {/* Header */}
            <StyledView className="p-4 pt-12 border-b border-gray-800">
                <StyledText className="text-white font-cinematic text-2xl">Notifications</StyledText>
            </StyledView>

            {notifications.length === 0 ? (
                <StyledView className="flex-1 items-center justify-center">
                    <Ionicons name="notifications-off-outline" size={64} color="#52525b" />
                    <StyledText className="text-text-secondary mt-4">No notifications yet</StyledText>
                </StyledView>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EAB308" />
                    }
                />
            )}
        </StyledView>
    );
}
