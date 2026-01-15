import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

type AudioTab = 'music' | 'voice';

interface AudioToolsProps {
    onMusicSelect: (trackId: string | null) => void;
    onVoiceRecorded: (uri: string | null) => void;
}

const MOCK_TRACKS = [
    { id: 'epic-rise', title: 'Epic Rise', duration: '2:15' },
    { id: 'suspense', title: 'Dark Suspense', duration: '1:45' },
    { id: 'upbeat', title: 'High Energy', duration: '1:30' },
];

export function AudioTools({ onMusicSelect, onVoiceRecorded }: AudioToolsProps) {
    const [activeTab, setActiveTab] = useState<AudioTab>('music');
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [voiceUri, setVoiceUri] = useState<string | null>(null);

    // Permission handling (simple check)
    const startRecording = async () => {
        try {
            console.log('Requesting permissions..');
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                console.log('Starting recording..');
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                setIsRecording(true);
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        console.log('Stopping recording..');
        if (!recording) return;
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setVoiceUri(uri);
        onVoiceRecorded(uri);
    };

    const handleTrackSelect = (id: string) => {
        const newTrack = selectedTrack === id ? null : id;
        setSelectedTrack(newTrack);
        onMusicSelect(newTrack);
    };

    return (
        <StyledView className="w-full">
            {/* Tabs */}
            <StyledView className="flex-row border-b border-gray-800 mb-4">
                <StyledTouchableOpacity
                    onPress={() => setActiveTab('music')}
                    className={`flex-1 p-3 items-center ${activeTab === 'music' ? 'border-b-2 border-primary' : ''}`}
                >
                    <StyledText className={activeTab === 'music' ? 'text-primary font-bold' : 'text-text-secondary'}>Music</StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                    onPress={() => setActiveTab('voice')}
                    className={`flex-1 p-3 items-center ${activeTab === 'voice' ? 'border-b-2 border-primary' : ''}`}
                >
                    <StyledText className={activeTab === 'voice' ? 'text-primary font-bold' : 'text-text-secondary'}>Voiceover</StyledText>
                </StyledTouchableOpacity>
            </StyledView>

            {/* Content */}
            <StyledView className="h-40">
                {activeTab === 'music' ? (
                    <ScrollView>
                        {MOCK_TRACKS.map(track => (
                            <StyledTouchableOpacity
                                key={track.id}
                                onPress={() => handleTrackSelect(track.id)}
                                className={`flex-row justify-between items-center p-3 mb-2 rounded-lg bg-surface-highlight border ${selectedTrack === track.id ? 'border-primary' : 'border-transparent'}`}
                            >
                                <StyledView className="flex-row items-center">
                                    <Ionicons name="musical-note" size={20} color={selectedTrack === track.id ? '#EAB308' : '#A1A1AA'} />
                                    <StyledText className={`ml-3 ${selectedTrack === track.id ? 'text-white' : 'text-text-secondary'}`}>
                                        {track.title}
                                    </StyledText>
                                </StyledView>
                                <StyledText className="text-text-tertiary text-xs">{track.duration}</StyledText>
                            </StyledTouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <StyledView className="flex-1 justify-center items-center">
                        {voiceUri ? (
                            <StyledView className="items-center">
                                <StyledText className="text-green-500 mb-2">Voiceover Recorded!</StyledText>
                                <StyledTouchableOpacity onPress={() => setVoiceUri(null)} className="flex-row items-center bg-gray-800 px-4 py-2 rounded-full">
                                    <Ionicons name="trash" size={16} color="red" />
                                    <StyledText className="text-red-500 ml-2">Delete & Retry</StyledText>
                                </StyledTouchableOpacity>
                            </StyledView>
                        ) : (
                            <StyledTouchableOpacity
                                onPressIn={startRecording}
                                onPressOut={stopRecording}
                                className={`w-20 h-20 rounded-full justify-center items-center ${isRecording ? 'bg-red-600' : 'bg-red-500'}`}
                            >
                                <Ionicons name="mic" size={32} color="white" />
                            </StyledTouchableOpacity>
                        )}
                        <StyledText className="text-text-secondary mt-2">
                            {isRecording ? "Recording..." : (voiceUri ? "Saved" : "Hold to Record")}
                        </StyledText>
                    </StyledView>
                )}
            </StyledView>
        </StyledView>
    );
}
