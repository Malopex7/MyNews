import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Define local FlashMode type to avoid import issues
type FlashMode = 'on' | 'off' | 'auto' | 'torch';

interface ICameraControlsProps {
    onClose: () => void;
    onFlipCamera: () => void;
    onToggleFlash: () => void;
    flash: FlashMode;
    isRecording: boolean;
}

export function CameraControls({
    onClose,
    onFlipCamera,
    onToggleFlash,
    flash,
    isRecording,
}: ICameraControlsProps) {
    const getFlashIcon = () => {
        switch (flash) {
            case 'on':
                return 'flash';
            case 'auto':
                return 'flash-outline';
            case 'torch':
                return 'flash'; // Use generic flash icon for torch
            default:
                return 'flash-off';
        }
    };

    return (
        <StyledView className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4 z-10">
            {/* Close button */}
            <StyledTouchableOpacity
                onPress={onClose}
                className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
                disabled={isRecording}
            >
                <Ionicons
                    name="close"
                    size={24}
                    color={isRecording ? '#666' : 'white'}
                />
            </StyledTouchableOpacity>

            {/* Right side controls */}
            <StyledView className="flex-row gap-4">
                {/* Flash toggle */}
                <StyledTouchableOpacity
                    onPress={onToggleFlash}
                    className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
                    disabled={isRecording}
                >
                    <Ionicons
                        name={getFlashIcon()}
                        size={20}
                        color={isRecording ? '#666' : 'white'}
                    />
                </StyledTouchableOpacity>

                {/* Flip camera */}
                <StyledTouchableOpacity
                    onPress={onFlipCamera}
                    className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
                    disabled={isRecording}
                >
                    <Ionicons
                        name="camera-reverse"
                        size={22}
                        color={isRecording ? '#666' : 'white'}
                    />
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    );
}
