import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, Button } from '../../components';
import { useAuth } from '../../hooks';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => router.push('/edit-profile') },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => { } },
        { icon: 'lock-closed-outline', label: 'Privacy', onPress: () => { } },
        { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => { } },
        { icon: 'information-circle-outline', label: 'About', onPress: () => { } },
    ];

    const formatCreativeFocus = (focus: string | undefined) => {
        if (!focus) return null;
        return focus.charAt(0).toUpperCase() + focus.slice(1);
    };

    return (
        <StyledView className="flex-1 bg-background">
            <StatusBar style="light" />
            <StyledScrollView className="flex-1 p-4">
                {/* Profile Header */}
                <Card variant="elevated" className="mb-4 items-center bg-surface border-surface-highlight">
                    {/* Avatar */}
                    {user?.avatarUrl ? (
                        <StyledImage
                            source={{ uri: user.avatarUrl }}
                            className="w-20 h-20 rounded-full mb-3"
                        />
                    ) : (
                        <StyledView className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
                            <StyledText className="text-3xl font-bold text-surface">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </StyledText>
                        </StyledView>
                    )}

                    {/* Name */}
                    <StyledText className="text-xl font-bold text-text-primary">
                        {user?.name || 'User'}
                    </StyledText>

                    {/* Email */}
                    <StyledText className="text-text-secondary text-sm">
                        {user?.email || 'user@example.com'}
                    </StyledText>

                    {/* Bio */}
                    {user?.bio && (
                        <StyledText className="text-text-secondary text-center mt-2 px-4">
                            {user.bio}
                        </StyledText>
                    )}

                    {/* Badges Row */}
                    <StyledView className="flex-row gap-2 mt-3">
                        {/* Profile Type Badge */}
                        <StyledView className="bg-surface-highlight px-3 py-1 rounded-full">
                            <StyledText className="text-primary text-sm font-medium capitalize">
                                {user?.profileType || 'viewer'}
                            </StyledText>
                        </StyledView>

                        {/* Creative Focus Badge */}
                        {user?.creativeFocus && (
                            <StyledView className="bg-primary/20 px-3 py-1 rounded-full">
                                <StyledText className="text-primary text-sm font-medium">
                                    {formatCreativeFocus(user.creativeFocus)}
                                </StyledText>
                            </StyledView>
                        )}
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
