import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../state/authStore';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export default function TabLayout() {
    const [unreadCount, setUnreadCount] = useState(0);
    const accessToken = useAuthStore((state: any) => state.accessToken);
    const { expoPushToken } = usePushNotifications();

    // Register push token with backend when we have both token and auth
    useEffect(() => {
        if (expoPushToken && accessToken) {
            registerPushToken(expoPushToken, accessToken);
        }
    }, [expoPushToken, accessToken]);

    const registerPushToken = async (token: string, authToken: string) => {
        try {
            await fetch('http://localhost:3001/api/users/me/push-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expoPushToken: token }),
            });
            console.log('Push token registered successfully');
        } catch (error) {
            console.error('Error registering push token:', error);
        }
    };

    const fetchUnreadCount = async () => {
        if (!accessToken) return;
        try {
            const response = await fetch('http://localhost:3001/api/notifications?unreadOnly=true', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setUnreadCount(data.total || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        // Poll every 30 seconds for updates
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [accessToken]);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#18181b', // surface (zinc-900)
                    borderTopColor: '#27272a', // surface-highlight (zinc-800)
                    borderTopWidth: 1,
                },
                tabBarActiveTintColor: '#f59e0b', // primary (amber-500)
                tabBarInactiveTintColor: '#a1a1aa', // text-secondary (zinc-400)
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    title: 'Feed',
                    tabBarIcon: ({ color, size }) => <Ionicons name="film-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="inbox"
                options={{
                    title: 'Inbox',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ width: size, height: size }}>
                            <Ionicons name="chatbubble-outline" size={size} color={color} />
                            {unreadCount > 0 && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: -6,
                                        top: -4,
                                        backgroundColor: '#EF4444',
                                        borderRadius: 10,
                                        minWidth: 18,
                                        height: 18,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 4,
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
