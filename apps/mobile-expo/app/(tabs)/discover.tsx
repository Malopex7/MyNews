import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function PlaceholderScreen() {
    return (
        <StyledView className="flex-1 items-center justify-center bg-background">
            <StyledText className="text-text-secondary">Coming Soon</StyledText>
        </StyledView>
    );
}
