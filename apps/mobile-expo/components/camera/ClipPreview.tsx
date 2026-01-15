import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { IClip } from '../../state';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface IClipPreviewProps {
    clip: IClip;
    onRetake: () => void;
    onUseClip: () => void;
    minDuration: number;
}

export function ClipPreview({ clip, onRetake, onUseClip, minDuration }: IClipPreviewProps) {
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const meetsMinDuration = clip.duration >= minDuration;

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
        }
    };

    const togglePlayback = async () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    };

    return (
        <StyledView className="flex-1 bg-background">
            {/* Video Preview */}
            <StyledView className="flex-1 relative">
                <Video
                    ref={videoRef}
                    source={{ uri: clip.uri }}
                    style={{ flex: 1 }}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />

                {/* Play/Pause overlay */}
                <StyledTouchableOpacity
                    onPress={togglePlayback}
                    className="absolute inset-0 items-center justify-center"
                    activeOpacity={1}
                >
                    {!isPlaying && (
                        <StyledView className="w-16 h-16 rounded-full bg-black/50 items-center justify-center">
                            <Ionicons name="play" size={32} color="white" />
                        </StyledView>
                    )}
                </StyledTouchableOpacity>

                {/* Duration badge */}
                <StyledView className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full">
                    <StyledText className="text-white font-body text-sm">
                        {formatDuration(clip.duration)}
                    </StyledText>
                </StyledView>

                {/* Warning if too short */}
                {!meetsMinDuration && (
                    <StyledView className="absolute top-4 left-4 bg-accent/90 px-3 py-1 rounded-full">
                        <StyledText className="text-white font-body text-xs">
                            Min {minDuration}s required
                        </StyledText>
                    </StyledView>
                )}
            </StyledView>

            {/* Action buttons */}
            <StyledView className="absolute bottom-0 left-0 right-0 pb-10 pt-6 px-6 bg-gradient-to-t from-background to-transparent">
                <StyledView className="flex-row justify-between gap-4">
                    {/* Retake button */}
                    <StyledTouchableOpacity
                        onPress={onRetake}
                        className="flex-1 py-4 rounded-xl bg-surface-highlight items-center"
                    >
                        <StyledView className="flex-row items-center gap-2">
                            <Ionicons name="refresh" size={20} color="#f4f4f5" />
                            <StyledText className="text-text-primary font-body-bold text-base">
                                Retake
                            </StyledText>
                        </StyledView>
                    </StyledTouchableOpacity>

                    {/* Use Clip button */}
                    <StyledTouchableOpacity
                        onPress={onUseClip}
                        disabled={!meetsMinDuration}
                        className={`flex-1 py-4 rounded-xl items-center ${meetsMinDuration ? 'bg-primary' : 'bg-primary/50'
                            }`}
                    >
                        <StyledView className="flex-row items-center gap-2">
                            <Ionicons
                                name="checkmark"
                                size={20}
                                color={meetsMinDuration ? '#000' : '#666'}
                            />
                            <StyledText
                                className={`font-body-bold text-base ${meetsMinDuration ? 'text-black' : 'text-gray-500'
                                    }`}
                            >
                                Use Clip
                            </StyledText>
                        </StyledView>
                    </StyledTouchableOpacity>
                </StyledView>
            </StyledView>
        </StyledView>
    );
}
