import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export type TitleCardStyle = 'coming-soon' | 'what-if' | 'standard';

interface TitleCardOverlayProps {
    text: string;
    styleVariant: TitleCardStyle;
    isVisible: boolean;
}

export function TitleCardOverlay({ text, styleVariant, isVisible }: TitleCardOverlayProps) {
    if (!isVisible) return null;

    // determine styles based on variant
    let containerClasses = "absolute inset-0 justify-center items-center z-20 pointer-events-none"; // pointer-events-none allows clicks to pass through to video
    let textClasses = "text-white text-center";

    switch (styleVariant) {
        case 'coming-soon':
            textClasses += " font-cinematic text-5xl tracking-widest uppercase shadow-lg shadow-black";
            break;
        case 'what-if':
            textClasses += " font-body-bold text-4xl italic text-primary";
            break;
        case 'standard':
        default:
            textClasses += " font-body text-3xl";
            break;
    }

    return (
        <StyledView className={containerClasses}>
            <StyledText className={textClasses}>
                {text}
            </StyledText>
        </StyledView>
    );
}
