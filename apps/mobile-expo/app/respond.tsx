import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function RespondScreen() {
    const router = useRouter();
    const { originalId } = useLocalSearchParams<{ originalId: string }>();
    const [originalMedia, setOriginalMedia] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOriginalMedia();
    }, [originalId]);

    const fetchOriginalMedia = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/media/${originalId}/info`);
            const data = await response.json();
            setOriginalMedia(data);
        } catch (error) {
            console.error('Failed to fetch original media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFullResponse = async () => {
        // Open media library for full response
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const { uri, duration } = result.assets[0];
            router.push({
                pathname: '/editor',
                params: {
                    videoUri: uri,
                    duration: duration ? (duration / 1000).toString() : '0',
                    respondingTo: originalId,
                    responseType: 'full',
                },
            });
        }
    };

    const handleStitch = () => {
        // Navigate to stitch editor
        router.push({
            pathname: '/stitch',
            params: { originalId },
        });
    };

    if (loading) {
        return (
            <StyledView className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#EAB308" />
            </StyledView>
        );
    }

    if (!originalMedia) {
        return (
            <StyledView className="flex-1 bg-background items-center justify-center">
                <StyledText className="text-white">Original trailer not found</StyledText>
                <StyledTouchableOpacity onPress={() => router.push('/(tabs)/feed')} className="mt-4">
                    <StyledText className="text-primary">Go Back</StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        );
    }

    return (
        <StyledView className="flex-1 bg-background">
            {/* Header */}
            <StyledView className="flex-row items-center p-4 pt-12 border-b border-gray-800">
                <StyledTouchableOpacity onPress={() => router.push('/(tabs)/feed')} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </StyledTouchableOpacity>
                <StyledText className="text-white font-cinematic text-lg">Create Response</StyledText>
            </StyledView>

            {/* Original Trailer Card */}
            <StyledView className="m-6 p-4 bg-surface rounded-lg border border-gray-700">
                <StyledText className="text-primary font-bold mb-2 uppercase text-xs tracking-wider">
                    Responding to
                </StyledText>
                <StyledText className="text-white text-xl font-bold mb-1">
                    {originalMedia.filename || 'Untitled'}
                </StyledText>
                <StyledText className="text-text-secondary text-sm">
                    Original trailer by {originalMedia.uploadedBy || 'Unknown'}
                </StyledText>
            </StyledView>

            {/* Response Type Selection */}
            <StyledView className="px-6">
                <StyledText className="text-white text-lg font-bold mb-4">
                    Choose Response Type
                </StyledText>

                {/* Full Response Option */}
                <StyledTouchableOpacity
                    onPress={handleFullResponse}
                    className="bg-surface p-6 rounded-lg mb-4 border border-gray-700"
                >
                    <StyledView className="flex-row items-center mb-2">
                        <Ionicons name="videocam-outline" size={32} color="#EAB308" />
                        <StyledText className="text-white text-xl font-bold ml-3">
                            Full Response
                        </StyledText>
                    </StyledView>
                    <StyledText className="text-text-secondary">
                        Create your own trailer inspired by this one. Your video will be linked as a response.
                    </StyledText>
                </StyledTouchableOpacity>

                {/* Stitch Option */}
                <StyledTouchableOpacity
                    onPress={handleStitch}
                    className="bg-surface p-6 rounded-lg border border-gray-700"
                >
                    <StyledView className="flex-row items-center mb-2">
                        <Ionicons name="link-outline" size={32} color="#EAB308" />
                        <StyledText className="text-white text-xl font-bold ml-3">Stitch</StyledText>
                    </StyledView>
                    <StyledText className="text-text-secondary">
                        Combine a clip from this trailer with your response. The original clip will be shown first.
                    </StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
    );
}
