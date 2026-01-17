import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

export type MediaAsset = {
    uri: string;
    type: 'video' | 'image';
    duration?: number;
    width: number;
    height: number;
};

export const useMediaLibrary = () => {
    const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    const pickVideo = async (): Promise<MediaAsset | null> => {
        try {
            if (!permissionStatus?.granted) {
                const { granted } = await requestPermission();
                if (!granted) {
                    Alert.alert('Permission Required', 'Please allow access to your photo library to import videos.');
                    return null;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true, // Allow basic trimming if platform supports it
                quality: 1,
                videoMaxDuration: 180, // 3 minutes limit
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                return {
                    uri: asset.uri,
                    type: 'video', // We only asked for videos
                    duration: asset.duration ? asset.duration / 1000 : 0, // Convert ms to seconds
                    width: asset.width,
                    height: asset.height,
                };
            }

            return null;
        } catch (error) {
            console.error('Error picking video:', error);
            Alert.alert('Error', 'Failed to pick video from library.');
            return null;
        }
    };

    return {
        pickVideo,
        permissionStatus,
    };
};
