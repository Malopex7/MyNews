import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface CardProps extends ViewProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated';
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    className = '',
    ...props
}) => {
    const baseClasses = 'bg-white dark:bg-secondary-800 rounded-xl p-4';

    const variantClasses = {
        default: 'border border-secondary-200 dark:border-secondary-700',
        elevated: 'shadow-lg',
    };

    return (
        <StyledView className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </StyledView>
    );
};
