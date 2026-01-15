import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchable = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const baseClasses = 'rounded-lg items-center justify-center';

    const variantClasses = {
        primary: 'bg-primary-600 active:bg-primary-700',
        secondary: 'bg-secondary-600 active:bg-secondary-700',
        outline: 'bg-transparent border-2 border-primary-600',
    };

    const sizeClasses = {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
    };

    const textVariantClasses = {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-primary-600',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const disabledClasses = disabled ? 'opacity-50' : '';

    return (
        <StyledTouchable
            onPress={onPress}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className || ''}`}
            style={style}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#2563eb' : '#ffffff'} />
            ) : (
                <StyledText
                    className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]}`}
                    style={textStyle}
                >
                    {title}
                </StyledText>
            )}
        </StyledTouchable>
    );
};
