import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface VideoPlayerProps {
    uri: string;
    shouldPlay?: boolean;
    onProgress?: (position: number) => void;
    onDurationLoad?: (duration: number) => void;
}

export function VideoPlayer({ uri, shouldPlay = true, onProgress, onDurationLoad }: VideoPlayerProps) {
    const video = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const [isPlaying, setIsPlaying] = useState(shouldPlay);
    const [durationReported, setDurationReported] = useState(false);

    const handlePlayPause = async () => {
        if (!video.current) return;

        if (isPlaying) {
            await video.current.pauseAsync();
        } else {
            await video.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        setStatus(status);
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (onProgress) {
                onProgress(status.positionMillis / 1000); // Convert to seconds
            }
            // Report duration once when video loads
            if (!durationReported && status.durationMillis && onDurationLoad) {
                const durationSeconds = status.durationMillis / 1000;
                console.log('Video duration loaded:', durationSeconds);
                onDurationLoad(durationSeconds);
                setDurationReported(true);
            }
            if (status.didJustFinish) {
                setIsPlaying(false);
                video.current?.setPositionAsync(0);
            }
        }
    };

    return (
        <StyledView className="flex-1 bg-black justify-center items-center relative w-full h-full">
            <Video
                ref={video}
                style={styles.video}
                source={{ uri }}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                shouldPlay={shouldPlay}
            />

            {!isPlaying && (
                <StyledTouchableOpacity
                    className="absolute z-10 bg-black/50 p-4 rounded-full"
                    onPress={handlePlayPause}
                >
                    <Ionicons name="play" size={48} color="white" />
                </StyledTouchableOpacity>
            )}

            {isPlaying && (
                <StyledTouchableOpacity
                    className="absolute w-full h-full z-0"
                    onPress={handlePlayPause}
                />
            )}
        </StyledView>
    );
}

const styles = StyleSheet.create({
    video: {
        width: '100%',
        height: '100%',
    },
});
