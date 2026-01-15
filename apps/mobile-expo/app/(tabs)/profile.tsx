import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../components';
import { useAuth } from '../../hooks';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => { } },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => { } },
        { icon: 'lock-closed-outline', label: 'Privacy', onPress: () => { } },
        { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => { } },
        { icon: 'information-circle-outline', label: 'About', onPress: () => { } },
    ];

    return (
        <StyledView className="flex-1 bg-background">
            <StatusBar style="light" />
            <StyledScrollView className="flex-1 p-4">
                {/* Profile Header */}
                <Card variant="elevated" className="mb-4 items-center bg-surface border-surface-highlight">
                    <StyledView className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
                        <StyledText className="text-3xl font-bold text-surface">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </StyledText>
                    </StyledView>
                    <StyledText className="text-xl font-bold text-text-primary">
                        {user?.name || 'User'}
                    </StyledText>
                    <StyledText className="text-text-secondary">
                        {user?.email || 'user@example.com'}
                    </StyledText>
                    <StyledView className="bg-surface-highlight px-3 py-1 rounded-full mt-2">
                        <StyledText className="text-primary text-sm font-medium capitalize">
                            {user?.role || 'user'}
                        </StyledText>
                    </StyledView>
                </Card>

                {/* Menu Items */}
                <Card className="mb-4 bg-surface border-surface-highlight">
                    {menuItems.map((item, index) => (
                        <StyledTouchableOpacity
                            key={item.label}
                            className={`flex-row items-center py-4 ${index < menuItems.length - 1 ? 'border-b border-surface-highlight' : ''
                                }`}
                            onPress={item.onPress}
                        >
                            <Ionicons
                                name={item.icon as any}
                                size={24}
                                color="#a1a1aa"
                            />
                            <StyledText className="flex-1 ml-3 text-text-primary">
                                {item.label}
                            </StyledText>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#52525b"
                            />
                        </StyledTouchableOpacity>
                    ))}
                </Card>

                {/* Logout Button */}
                <Button title="Logout" onPress={logout} variant="secondary" className="bg-surface-highlight" />
            </StyledScrollView>
        </StyledView>
    );
}
