import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { userApi } from '../../services/api';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export default function RoleSelectionScreen() {
    const router = useRouter();
    const { user, setProfileType } = useAuthStore();
    const [submitting, setSubmitting] = useState(false);

    const handleSelectRole = async (role: 'viewer' | 'creator') => {
        if (!user || submitting) return;
        setSubmitting(true);

        try {
            // Update on backend
            await userApi.update(user.id, { profileType: role });

            // Update local state
            await setProfileType(role);

            // Navigate to main app
            router.replace('/(tabs)/feed');
        } catch (error) {
            console.error('Failed to set role:', error);
            // Ideally show toast/alert here
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <StyledView className="flex-1 bg-background pt-12 px-6">
            <StatusBar style="light" />
            <StyledScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <StyledView className="items-center mb-12 mt-6">
                    <StyledText className="text-3xl font-bold text-primary font-display mb-3">
                        Choose Your Path
                    </StyledText>
                    <StyledText className="text-text-secondary text-2xl text-center">
                        How do you want to use FanFlick?
                    </StyledText>
                </StyledView>

                <StyledView className="gap-6">
                    {/* Viewer Card */}
                    <StyledTouchableOpacity
                        className="bg-surface border-2 border-surface-highlight rounded-2xl p-6 items-center active:border-primary active:bg-surface-highlight"
                        onPress={() => handleSelectRole('viewer')}
                        disabled={submitting}
                    >
                        <StyledView className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-4">
                            <Ionicons name="play" size={32} color="#f59e0b" />
                        </StyledView>
                        <StyledText className="text-xl font-bold text-white mb-2">
                            I want to Watch
                        </StyledText>
                        <StyledText className="text-text-secondary text-center">
                            Discover original trailers, parodies, and fan-edits from creators worldwide.
                        </StyledText>
                    </StyledTouchableOpacity>

                    {/* Creator Card */}
                    <StyledTouchableOpacity
                        className="bg-surface border-2 border-surface-highlight rounded-2xl p-6 items-center active:border-primary active:bg-surface-highlight"
                        onPress={() => handleSelectRole('creator')}
                        disabled={submitting}
                    >
                        <StyledView className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-4">
                            <Ionicons name="videocam" size={32} color="#f59e0b" />
                        </StyledView>
                        <StyledText className="text-xl font-bold text-white mb-2">
                            I want to Create
                        </StyledText>
                        <StyledText className="text-text-secondary text-center">
                            Share your vision. Create trailers, respond to challenges, and build your audience.
                        </StyledText>
                    </StyledTouchableOpacity>
                </StyledView>

            </StyledScrollView>
        </StyledView>
    );
}
