import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer } from '../components/editor/VideoPlayer';
import { Trimmer } from '../components/editor/Trimmer';
import { TitleCardOverlay, TitleCardStyle } from '../components/editor/TitleCardOverlay';
import { Toolbar, EditorTool } from '../components/editor/Toolbar';
import { AudioTools } from '../components/editor/AudioTools';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function EditorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ videoUri: string; duration: string }>();
    const videoUri = params.videoUri;
    const duration = parseFloat(params.duration || '0');

    console.log('Editor params:', { videoUri, duration, rawDuration: params.duration });

    // State
    const [actualDuration, setActualDuration] = useState(duration);
    const [currentTime, setCurrentTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(duration);
    const [activeTool, setActiveTool] = useState<EditorTool>('trim');
    const [titleCard, setTitleCard] = useState<{ text: string; style: TitleCardStyle; isVisible: boolean }>({
        text: 'COMING SOON',
        style: 'coming-soon',
        isVisible: false
    });
    const [audioTrack, setAudioTrack] = useState<string | null>(null);
    const [voiceUri, setVoiceUri] = useState<string | null>(null);

    const handleDurationLoad = (loadedDuration: number) => {
        console.log('Loaded duration from video:', loadedDuration);
        setActualDuration(loadedDuration);
        if (endTime === 0 || endTime === duration) {
            setEndTime(loadedDuration);
        }
    };

    const handleBack = () => {
        Alert.alert(
            'Discard Changes?',
            'Are you sure you want to go back? Any changes will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => router.back() },
            ]
        );
    };

    const handleSave = () => {
        const clipDuration = endTime - startTime;
        if (clipDuration < 30) {
            Alert.alert('Invalid Duration', 'Trailer must be at least 30 seconds long.');
            return;
        }
        if (clipDuration > 180) {
            Alert.alert('Invalid Duration', 'Trailer cannot exceed 3 minutes.');
            return;
        }

        console.log('Saving Trim:', { startTime, endTime, duration: clipDuration, titleCard, audioTrack, voiceUri });

        // Navigate to Publish Screen with params
        router.push({
            pathname: '/publish',
            params: {
                videoUri,
                startTime: startTime.toString(),
                endTime: endTime.toString(),
                titleText: titleCard.isVisible ? titleCard.text : undefined,
                titleStyle: titleCard.isVisible ? titleCard.style : undefined,
                audioTrack: audioTrack || undefined,
                voiceUri: voiceUri || undefined
            }
        });
    };

    const handleSetStart = (time: number) => {
        if (time >= endTime) {
            Alert.alert('Invalid Start Time', 'Start time must be before end time.');
            return;
        }
        setStartTime(time);
    };

    const handleSetEnd = (time: number) => {
        if (time <= startTime) {
            Alert.alert('Invalid End Time', 'End time must be after start time.');
            return;
        }
        setEndTime(time);
    };

    const toggleTitleCard = (style: TitleCardStyle, text: string) => {
        // If already visible with same style, toggle off
        if (titleCard.isVisible && titleCard.style === style) {
            setTitleCard(prev => ({ ...prev, isVisible: false }));
        } else {
            setTitleCard({ text, style, isVisible: true });
        }
    };

    if (!videoUri) {
        return (
            <StyledView className="flex-1 bg-background justify-center items-center">
                <StyledText className="text-text-primary">No video selected</StyledText>
                <StyledTouchableOpacity onPress={() => router.back()} className="mt-4">
                    <StyledText className="text-primary">Go Back</StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        );
    }

    return (
        <StyledView className="flex-1 bg-background">

            {/* Video Player & Overlay */}
            <StyledView className="flex-1 justify-center items-center relative">
                <VideoPlayer
                    uri={videoUri}
                    onProgress={setCurrentTime}
                    onDurationLoad={handleDurationLoad}
                />
                <TitleCardOverlay
                    text={titleCard.text}
                    styleVariant={titleCard.style}
                    isVisible={titleCard.isVisible}
                />
            </StyledView>

            {/* Controls Area */}
            <StyledView className="bg-surface pb-8">
                {/* Tool Specific Controls */}
                <StyledView className="min-h-[100px] justify-center">
                    {activeTool === 'trim' && (
                        <Trimmer
                            duration={actualDuration}
                            currentTime={currentTime}
                            startTime={startTime}
                            endTime={endTime}
                            onSetStart={handleSetStart}
                            onSetEnd={handleSetEnd}
                            onTrimChange={() => { }}
                        />
                    )}

                    {activeTool === 'title' && (
                        <StyledView className="flex-row justify-around p-4">
                            <StyledTouchableOpacity
                                onPress={() => toggleTitleCard('coming-soon', 'COMING SOON')}
                                className={`px-4 py-2 rounded-lg border ${titleCard.isVisible && titleCard.style === 'coming-soon' ? 'bg-primary border-primary' : 'border-gray-500'}`}
                            >
                                <StyledText className={titleCard.isVisible && titleCard.style === 'coming-soon' ? 'text-black font-bold' : 'text-gray-400'}>Coming Soon</StyledText>
                            </StyledTouchableOpacity>

                            <StyledTouchableOpacity
                                onPress={() => toggleTitleCard('what-if', 'WHAT IF...?')}
                                className={`px-4 py-2 rounded-lg border ${titleCard.isVisible && titleCard.style === 'what-if' ? 'bg-primary border-primary' : 'border-gray-500'}`}
                            >
                                <StyledText className={titleCard.isVisible && titleCard.style === 'what-if' ? 'text-black font-bold' : 'text-gray-400'}>What If</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    )}

                    {activeTool === 'audio' && (
                        <AudioTools
                            onMusicSelect={setAudioTrack}
                            onVoiceRecorded={setVoiceUri}
                        />
                    )}
                </StyledView>

                {/* Toolbar */}
                <Toolbar activeTool={activeTool} onSelectTool={setActiveTool} />
            </StyledView>

            {/* Header - Moved to bottom to ensure Z-Index stacking on top */}
            <StyledView className="flex-row justify-between items-center p-4 pt-12 bg-black/50 absolute top-0 w-full z-50">
                <StyledTouchableOpacity onPress={handleBack}>
                    <Ionicons name="close" size={28} color="white" />
                </StyledTouchableOpacity>
                <StyledText className="text-white font-cinematic text-lg">Editor</StyledText>
                <StyledTouchableOpacity onPress={handleSave}>
                    <StyledText className={`font-body-bold text-lg ${(endTime - startTime) >= 30 && (endTime - startTime) <= 180
                        ? 'text-primary'
                        : 'text-gray-500'
                        }`}>Next</StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    );
}
