import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface TrimmerProps {
    duration: number; // in seconds
    currentTime: number;
    startTime: number;
    endTime: number;
    onSetStart: (time: number) => void;
    onSetEnd: (time: number) => void;
    onTrimChange?: () => void;
}

export function Trimmer({ duration, currentTime, startTime, endTime, onSetStart, onSetEnd }: TrimmerProps) {
    const selectedDuration = endTime - startTime;
    const isValidDuration = selectedDuration >= 30 && selectedDuration <= 180;

    // Progress bar calculations
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
    const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;

    return (
        <StyledView className="bg-surface p-4 w-full justify-center">

            {/* Controls */}
            <StyledView className="flex-row justify-between items-center mb-4">
                <StyledTouchableOpacity
                    onPress={() => onSetStart(currentTime)}
                    className="bg-surface-highlight px-4 py-2 rounded-lg border border-border flex-row items-center"
                >
                    <Ionicons name="caret-forward-circle-outline" size={20} color="white" />
                    <StyledText className="text-white ml-2 font-body-bold">Set Start</StyledText>
                </StyledTouchableOpacity>

                <StyledView className="items-center">
                    <StyledText className={`font-cinematic text-lg ${isValidDuration ? 'text-green-500' : 'text-red-500'}`}>
                        {selectedDuration.toFixed(1)}s
                    </StyledText>
                    <StyledText className="text-text-tertiary text-xs">
                        (30s - 180s)
                    </StyledText>
                </StyledView>

                <StyledTouchableOpacity
                    onPress={() => onSetEnd(currentTime)}
                    className="bg-surface-highlight px-4 py-2 rounded-lg border border-border flex-row items-center"
                >
                    <StyledText className="text-white mr-2 font-body-bold">Set End</StyledText>
                    <Ionicons name="caret-back-circle-outline" size={20} color="white" />
                </StyledTouchableOpacity>
            </StyledView>

            {/* Timeline Visual */}
            <StyledView className="h-12 w-full bg-surface-highlight rounded-lg overflow-hidden relative border border-border">
                {/* Background Track */}
                <StyledView className="absolute inset-0 bg-gray-800" />

                {/* Selected Range */}
                <StyledView
                    style={{
                        left: `${startPercent}%`,
                        width: `${endPercent - startPercent}%`
                    }}
                    className="absolute top-0 bottom-0 bg-primary/30 border-l-2 border-r-2 border-primary"
                />

                {/* Playhead */}
                <StyledView
                    style={{ left: `${progressPercent}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-lg shadow-black"
                />
            </StyledView>

            <StyledView className="flex-row justify-between mt-1">
                <StyledText className="text-text-tertiary text-xs">{startTime.toFixed(1)}s</StyledText>
                <StyledText className="text-text-tertiary text-xs">{endTime.toFixed(1)}s</StyledText>
            </StyledView>

            {!isValidDuration && (
                <StyledText className="text-red-500 text-xs text-center mt-2">
                    {selectedDuration < 30 ? "Clip must be at least 30 seconds." : "Clip cannot exceed 3 minutes."}
                </StyledText>
            )}
        </StyledView>
    );
}
