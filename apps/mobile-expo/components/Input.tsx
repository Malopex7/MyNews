import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
    className?: string; // For the actual input
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerClassName = '',
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputClasses = `
    w-full px-4 py-3 rounded-lg border text-base
    ${error ? 'border-red-500' : isFocused ? 'border-primary-500' : 'border-secondary-300'}
    bg-white dark:bg-secondary-800
    text-secondary-900 dark:text-white
  `;

    return (
        <StyledView className={`mb-4 ${containerClassName}`}>
            {label && (
                <StyledText className="text-secondary-700 dark:text-secondary-300 mb-2 font-medium">
                    {label}
                </StyledText>
            )}
            <StyledTextInput
                className={`${inputClasses} ${className}`}
                placeholderTextColor="#94a3b8"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && (
                <StyledText className="text-red-500 text-sm mt-1">
                    {error}
                </StyledText>
            )}
        </StyledView>
    );
};
