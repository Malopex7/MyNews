import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface LoadingProps {
    size?: 'small' | 'large';
    color?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'large',
    color = '#3b82f6',
}) => {
    return (
        <StyledView className="flex-1 items-center justify-center bg-white dark:bg-secondary-900">
            <ActivityIndicator size={size} color={color} />
        </StyledView>
    );
};
