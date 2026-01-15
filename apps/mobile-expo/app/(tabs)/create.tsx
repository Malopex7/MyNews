import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCameraStore } from '../../state';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function CreateScreen() {
    const router = useRouter();
    const { recordedClips } = useCameraStore();

    const handleStartRecording = () => {
        router.push('/camera');
    };

    return (
        <StyledView className="flex-1 bg-background px-6 pt-16">
            {/* Header */}
            <StyledText className="text-text-primary font-cinematic text-3xl mb-2">
                The Studio
            </StyledText>
            <StyledText className="text-text-secondary font-body mb-8">
                Create your next trailer masterpiece
            </StyledText>

            {/* Recorded clips count badge */}
            {recordedClips.length > 0 && (
                <StyledView className="bg-surface rounded-xl p-4 mb-6 flex-row items-center justify-between">
                    <StyledView className="flex-row items-center gap-3">
                        <StyledView className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                            <Ionicons name="film" size={20} color="#f59e0b" />
                        </StyledView>
                        <StyledView>
                            <StyledText className="text-text-primary font-body-bold">
                                {recordedClips.length} Clip{recordedClips.length !== 1 ? 's' : ''} Ready
                            </StyledText>
                            <StyledText className="text-text-secondary font-body text-sm">
                                Continue editing your trailer
                            </StyledText>
                        </StyledView>
                    </StyledView>
                    <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
                </StyledView>
            )}

            {/* Start Recording CTA */}
            <StyledTouchableOpacity
                onPress={handleStartRecording}
                className="bg-surface rounded-2xl p-6 items-center border border-surface-highlight"
                activeOpacity={0.8}
            >
                <StyledView className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-4">
                    <StyledView className="w-14 h-14 rounded-full bg-accent items-center justify-center">
                        <Ionicons name="videocam" size={28} color="white" />
                    </StyledView>
                </StyledView>
                <StyledText className="text-text-primary font-cinematic text-xl mb-1">
                    Start Recording
                </StyledText>
                <StyledText className="text-text-secondary font-body text-sm text-center">
                    Capture clips for your trailer (30s - 3min)
                </StyledText>
            </StyledTouchableOpacity>

            {/* Future features hint */}
            <StyledView className="mt-8 opacity-50">
                <StyledText className="text-text-muted font-body text-sm mb-3">
                    Coming Soon
                </StyledText>
                <StyledView className="flex-row gap-4">
                    <StyledView className="flex-1 bg-surface/50 rounded-xl p-4 items-center">
                        <Ionicons name="images" size={24} color="#52525b" />
                        <StyledText className="text-text-muted font-body text-xs mt-2">
                            Gallery Import
                        </StyledText>
                    </StyledView>
                    <StyledView className="flex-1 bg-surface/50 rounded-xl p-4 items-center">
                        <Ionicons name="cut" size={24} color="#52525b" />
                        <StyledText className="text-text-muted font-body text-xs mt-2">
                            Timeline Editor
                        </StyledText>
                    </StyledView>
                    <StyledView className="flex-1 bg-surface/50 rounded-xl p-4 items-center">
                        <Ionicons name="musical-notes" size={24} color="#52525b" />
                        <StyledText className="text-text-muted font-body text-xs mt-2">
                            Audio Tools
                        </StyledText>
                    </StyledView>
                </StyledView>
            </StyledView>
        </StyledView>
    );
}
