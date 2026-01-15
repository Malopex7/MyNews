import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../components';
import { useAuth } from '../hooks';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const ProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => { } },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => { } },
        { icon: 'lock-closed-outline', label: 'Privacy', onPress: () => { } },
        { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => { } },
        { icon: 'information-circle-outline', label: 'About', onPress: () => { } },
    ];

    return (
        <StyledView className="flex-1 bg-secondary-50 dark:bg-secondary-900">
            <StatusBar style="auto" />
            <StyledScrollView className="flex-1 p-4">
                {/* Profile Header */}
                <Card variant="elevated" className="mb-4 items-center">
                    <StyledView className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mb-3">
                        <StyledText className="text-3xl font-bold text-primary-600">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </StyledText>
                    </StyledView>
                    <StyledText className="text-xl font-bold text-secondary-900 dark:text-white">
                        {user?.name || 'User'}
                    </StyledText>
                    <StyledText className="text-secondary-500">
                        {user?.email || 'user@example.com'}
                    </StyledText>
                    <StyledView className="bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full mt-2">
                        <StyledText className="text-primary-600 text-sm font-medium capitalize">
                            {user?.role || 'user'}
                        </StyledText>
                    </StyledView>
                </Card>

                {/* Menu Items */}
                <Card className="mb-4">
                    {menuItems.map((item, index) => (
                        <StyledTouchableOpacity
                            key={item.label}
                            className={`flex-row items-center py-4 ${index < menuItems.length - 1 ? 'border-b border-secondary-100 dark:border-secondary-700' : ''
                                }`}
                            onPress={item.onPress}
                        >
                            <Ionicons
                                name={item.icon as any}
                                size={24}
                                color="#64748b"
                            />
                            <StyledText className="flex-1 ml-3 text-secondary-900 dark:text-white">
                                {item.label}
                            </StyledText>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#94a3b8"
                            />
                        </StyledTouchableOpacity>
                    ))}
                </Card>

                {/* Logout Button */}
                <Button title="Logout" onPress={logout} variant="secondary" />
            </StyledScrollView>
        </StyledView>
    );
};
