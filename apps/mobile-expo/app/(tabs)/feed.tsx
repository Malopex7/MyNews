import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Card } from '../../components';
import { useAuth } from '../../hooks';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export default function FeedScreen() {
    const { user } = useAuth();

    return (
        <StyledView className="flex-1 bg-background">
            <StatusBar style="light" />
            <StyledScrollView className="flex-1 p-4">
                <Card variant="elevated" className="mb-4 bg-surface border-surface-highlight">
                    <StyledText className="text-2xl font-bold text-text-primary mb-2">
                        Welcome back! 👋
                    </StyledText>
                    <StyledText className="text-text-secondary">
                        {user?.name || 'User'}
                    </StyledText>
                </Card>

                <StyledView className="flex-1 items-center justify-center p-8">
                    <StyledText className="text-text-muted text-center">
                        Your feed is empty. Follow creators to see their trailers here.
                    </StyledText>
                </StyledView>
            </StyledScrollView>
        </StyledView>
    );
}
