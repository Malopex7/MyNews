import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Card, Button } from '../components';
import { useAuth } from '../hooks';
import { useApi } from '../hooks';
import { userApi } from '../services';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export const HomeScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const { data: profile, isLoading, execute: fetchProfile } = useApi(userApi.getMe);

    React.useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <StyledView className="flex-1 bg-secondary-50 dark:bg-secondary-900">
            <StatusBar style="auto" />
            <StyledScrollView className="flex-1 p-4">
                {/* Welcome Card */}
                <Card variant="elevated" className="mb-4">
                    <StyledText className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                        Welcome back! 👋
                    </StyledText>
                    <StyledText className="text-secondary-600 dark:text-secondary-400">
                        {user?.name || 'User'}
                    </StyledText>
                </Card>

                {/* Profile Info Card */}
                <Card className="mb-4">
                    <StyledText className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
                        Your Profile
                    </StyledText>
                    {isLoading ? (
                        <StyledText className="text-secondary-500">Loading...</StyledText>
                    ) : profile ? (
                        <StyledView>
                            <StyledView className="flex-row justify-between py-2 border-b border-secondary-100 dark:border-secondary-700">
                                <StyledText className="text-secondary-500">Email</StyledText>
                                <StyledText className="text-secondary-900 dark:text-white">{profile.email}</StyledText>
                            </StyledView>
                            <StyledView className="flex-row justify-between py-2 border-b border-secondary-100 dark:border-secondary-700">
                                <StyledText className="text-secondary-500">Role</StyledText>
                                <StyledText className="text-secondary-900 dark:text-white capitalize">{profile.role}</StyledText>
                            </StyledView>
                        </StyledView>
                    ) : (
                        <StyledText className="text-secondary-500">Unable to load profile</StyledText>
                    )}
                </Card>

                {/* Quick Actions */}
                <Card className="mb-4">
                    <StyledText className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
                        Quick Actions
                    </StyledText>
                    <StyledView className="space-y-3">
                        <Button title="Refresh Profile" onPress={() => fetchProfile()} variant="outline" />
                        <Button title="Logout" onPress={logout} variant="secondary" />
                    </StyledView>
                </Card>
            </StyledScrollView>
        </StyledView>
    );
};
