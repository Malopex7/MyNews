import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function StitchScreen() {
    const router = useRouter();
    const { originalId } = useLocalSearchParams<{ originalId: string }>();
    const videoRef = useRef<Video>(null);

    const [loading, setLoading] = useState(false);
    const [originalVideoUri, setOriginalVideoUri] = useState('');
    const [duration, setDuration] = useState(0);
    const [clipStart, setClipStart] = useState(0);
    const [clipEnd, setClipEnd] = useState(5); // Default 5 second clip

    React.useEffect(() => {
        // Fetch original video
        setOriginalVideoUri(`http://localhost:3001/api/media/${originalId}`);
    }, [originalId]);

    const handleNext = async () => {
        // Open media library for user's response clip
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const { uri, duration: userDuration } = result.assets[0];

            // Navigate to editor with stitch metadata
            router.push({
                pathname: '/editor',
                params: {
                    videoUri: uri,
                    duration: userDuration ? (userDuration / 1000).toString() : '0',
                    respondingTo: originalId,
                    responseType: 'stitch',
                    originalClipStart: clipStart.toString(),
                    originalClipEnd: clipEnd.toString(),
                },
            });
        }
    };

    return (
        <StyledView className="flex-1 bg-background">
            {/* Header */}
            <StyledView className="flex-row items-center p-4 pt-12 border-b border-gray-800">
                <StyledTouchableOpacity
                    onPress={() => originalId ? router.push(`/respond?originalId=${originalId}`) : router.push('/(tabs)/feed')}
                    className="mr-4"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </StyledTouchableOpacity>
                <StyledText className="text-white font-cinematic text-lg">Select Clip to Stitch</StyledText>
            </StyledView>

            {/* Video Player */}
            <StyledView className="flex-1 bg-black">
                {originalVideoUri ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: originalVideoUri }}
                        style={{ flex: 1 }}
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={false}
                        isLooping
                        onReadyForDisplay={(status: any) => {
                            if (status.naturalSize?.orientation) {
                                const videoDuration = status.durationMillis / 1000;
                                setDuration(videoDuration);
                                setClipEnd(Math.min(5, videoDuration));
                            }
                        }}
                        onPlaybackStatusUpdate={(status: any) => {
                            if ('durationMillis' in status && status.durationMillis) {
                                const videoDuration = status.durationMillis / 1000;
                                setDuration(videoDuration);
                            }
                        }}
                    />
                ) : (
                    <StyledView className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#EAB308" />
                    </StyledView>
                )}
            </StyledView>

            {/* Trim Controls */}
            <StyledView className="bg-surface p-6 border-t border-gray-800">
                <StyledText className="text-primary font-bold mb-4 uppercase text-xs tracking-wider">
                    Select Clip (Max 10 seconds)
                </StyledText>

                <StyledView className="mb-4">
                    <StyledView className="flex-row justify-between items-center mb-2">
                        <StyledText className="text-text-secondary text-sm">
                            Start: {clipStart.toFixed(1)}s
                        </StyledText>
                        <StyledTouchableOpacity
                            className="bg-primary px-4 py-2 rounded"
                            onPress={() => {
                                const newStart = Math.max(0, clipStart - 0.5);
                                setClipStart(newStart);
                            }}
                        >
                            <StyledText className="text-black font-bold">-0.5s</StyledText>
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity
                            className="bg-primary px-4 py-2 rounded"
                            onPress={() => {
                                const newStart = Math.min(duration - 1, clipStart + 0.5);
                                if (newStart < clipEnd) {
                                    setClipStart(newStart);
                                }
                            }}
                        >
                            <StyledText className="text-black font-bold">+0.5s</StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>

                <StyledView className="mb-6">
                    <StyledView className="flex-row justify-between items-center mb-2">
                        <StyledText className="text-text-secondary text-sm">
                            End: {clipEnd.toFixed(1)}s
                        </StyledText>
                        <StyledTouchableOpacity
                            className="bg-primary px-4 py-2 rounded"
                            onPress={() => {
                                const newEnd = Math.max(clipStart + 0.5, clipEnd - 0.5);
                                setClipEnd(newEnd);
                            }}
                        >
                            <StyledText className="text-black font-bold">-0.5s</StyledText>
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity
                            className="bg-primary px-4 py-2 rounded"
                            onPress={() => {
                                const newEnd = Math.min(Math.min(clipStart + 10, duration), clipEnd + 0.5);
                                setClipEnd(newEnd);
                            }}
                        >
                            <StyledText className="text-black font-bold">+0.5s</StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>

                <StyledView className="flex-row justify-between items-center mb-4">
                    <StyledText className="text-text-secondary">
                        Clip Duration: {(clipEnd - clipStart).toFixed(1)}s
                    </StyledText>
                </StyledView>

                <StyledTouchableOpacity
                    onPress={handleNext}
                    className="w-full bg-primary py-4 rounded-lg items-center"
                >
                    <StyledText className="text-black font-cinematic text-lg tracking-widest">
                        NEXT: SELECT YOUR CLIP
                    </StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    );
}
