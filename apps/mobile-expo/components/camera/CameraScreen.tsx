import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMediaLibrary } from '../../hooks/useMediaLibrary';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function CameraScreen() {
    const router = useRouter();
    const { pickVideo } = useMediaLibrary();
    const [isLoading, setIsLoading] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);

    const handleClose = () => {
        router.back();
    };

    const handleImport = async () => {
        try {
            setIsLoading(true);
            setImportError(null);

            const video = await pickVideo();

            if (video) {
                console.log('Video selected:', video);
                // Navigate to Editor
                router.push({
                    pathname: '/editor',
                    params: {
                        videoUri: video.uri,
                        duration: video.duration
                    }
                });
            } else {
                // User cancelled or no video selected, no error needed unless it was a permission error handled in hook
            }
        } catch (error) {
            console.error(error);
            setImportError('Failed to import video. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledView className="flex-1 bg-background items-center justify-center p-8">
            <StyledView className="bg-surface-highlight p-6 rounded-2xl items-center w-full max-w-sm">
                <StyledView className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-4">
                    {isLoading ? (
                        <ActivityIndicator color="#EAB308" size="large" />
                    ) : (
                        <Ionicons name="videocam-off" size={32} color="#a1a1aa" />
                    )}
                </StyledView>

                <StyledText className="text-text-primary font-cinematic text-2xl mb-2 text-center">
                    {isLoading ? 'Importing...' : 'Camera Unavailable'}
                </StyledText>

                <StyledText className="text-text-secondary font-body text-center mb-6">
                    {isLoading
                        ? 'Processing your video selection...'
                        : 'Video recording requires a physical device. You can import an existing video from your gallery.'
                    }
                </StyledText>

                {importError && (
                    <StyledText className="text-red-500 font-body text-center mb-4">
                        {importError}
                    </StyledText>
                )}

                {!isLoading && (
                    <>
                        <StyledTouchableOpacity
                            onPress={handleImport}
                            className="bg-primary px-8 py-3 rounded-xl w-full mb-4 flex-row items-center justify-center space-x-2"
                        >
                            <Ionicons name="images" size={20} color="black" />
                            <StyledText className="text-black font-body-bold ml-2">
                                Import from Gallery
                            </StyledText>
                        </StyledTouchableOpacity>

                        <StyledTouchableOpacity
                            onPress={handleClose}
                            className="bg-surface px-8 py-3 rounded-xl w-full border border-border"
                        >
                            <StyledText className="text-text-primary font-body-bold text-center">
                                Go Back
                            </StyledText>
                        </StyledTouchableOpacity>
                    </>
                )}
            </StyledView>
        </StyledView>
    );
}
