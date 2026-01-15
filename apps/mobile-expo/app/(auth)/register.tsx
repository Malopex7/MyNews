import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function RegisterScreen() {
    const router = useRouter();

    return (
        <StyledView className="flex-1 items-center justify-center bg-background p-4">
            <StatusBar style="light" />
            <StyledText className="text-2xl font-bold text-primary mb-4">Register</StyledText>
            <StyledText className="text-text-secondary mb-8 text-center">
                Create your FanFlick account to start creating trailers.
            </StyledText>

            <StyledTouchableOpacity
                onPress={() => router.back()}
                className="px-4 py-2"
            >
                <StyledText className="text-primary font-semibold">Back to Login</StyledText>
            </StyledTouchableOpacity>
        </StyledView>
    );
}
