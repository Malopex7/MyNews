import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function CameraScreen() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    return (
        <StyledView className="flex-1 bg-background items-center justify-center p-8">
            <StyledView className="bg-surface-highlight p-6 rounded-2xl items-center w-full max-w-sm">
                <StyledView className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-4">
                    <Ionicons name="videocam-off" size={32} color="#a1a1aa" />
                </StyledView>

                <StyledText className="text-text-primary font-cinematic text-2xl mb-2 text-center">
                    Camera Unavailable
                </StyledText>

                <StyledText className="text-text-secondary font-body text-center mb-6">
                    Video recording requires a physical device. This feature is currently disabled for testing.
                </StyledText>

                <StyledTouchableOpacity
                    onPress={handleClose}
                    className="bg-primary px-8 py-3 rounded-xl w-full"
                >
                    <StyledText className="text-black font-body-bold text-center">
                        Go Back
                    </StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    );
}
