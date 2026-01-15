import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card, Input } from '../components';
import { useAuthStore } from '../state/authStore';
import { userApi } from '../services/api';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledTextInput = styled(TextInput);

const CREATIVE_FOCUS_OPTIONS = [
    { value: 'action', label: 'Action', icon: '💥' },
    { value: 'comedy', label: 'Comedy', icon: '😂' },
    { value: 'drama', label: 'Drama', icon: '🎭' },
    { value: 'sci-fi', label: 'Sci-Fi', icon: '🚀' },
    { value: 'horror', label: 'Horror', icon: '👻' },
    { value: 'documentary', label: 'Documentary', icon: '🎬' },
    { value: 'thriller', label: 'Thriller', icon: '🔪' },
    { value: 'romance', label: 'Romance', icon: '💕' },
];

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, setProfileType } = useAuthStore();

    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [creativeFocus, setCreativeFocus] = useState(user?.creativeFocus || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0]) {
            // For MVP, we'll use the local URI as a placeholder
            // In production, this would upload to S3/Cloudinary first
            setAvatarUrl(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            const updates: any = { name, bio, creativeFocus };

            // Only include avatarUrl if it's a valid URL (not local file)
            if (avatarUrl && avatarUrl.startsWith('http')) {
                updates.avatarUrl = avatarUrl;
            }

            await userApi.update(user.id, updates);

            // Update local state
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
                const updatedUser = { ...currentUser, name, bio, creativeFocus, avatarUrl };
                await useAuthStore.getState().setAuth(
                    updatedUser,
                    useAuthStore.getState().accessToken!,
                    useAuthStore.getState().refreshToken!
                );
            }

            router.back();
        } catch (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StyledView className="flex-1 bg-background">
            <StatusBar style="light" />

            {/* Header */}
            <StyledView className="flex-row items-center justify-between p-4 border-b border-surface-highlight">
                <StyledTouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#f4f4f5" />
                </StyledTouchableOpacity>
                <StyledText className="text-xl font-bold text-text-primary">Edit Profile</StyledText>
                <StyledTouchableOpacity onPress={handleSave} disabled={isSubmitting}>
                    <StyledText className={`text-primary font-semibold ${isSubmitting ? 'opacity-50' : ''}`}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </StyledText>
                </StyledTouchableOpacity>
            </StyledView>

            <StyledScrollView className="flex-1 p-4">
                {/* Avatar Section */}
                <StyledView className="items-center mb-6">
                    <StyledTouchableOpacity onPress={pickImage} className="relative">
                        {avatarUrl ? (
                            <StyledImage
                                source={{ uri: avatarUrl }}
                                className="w-24 h-24 rounded-full"
                            />
                        ) : (
                            <StyledView className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                                <StyledText className="text-4xl font-bold text-surface">
                                    {name?.charAt(0).toUpperCase() || 'U'}
                                </StyledText>
                            </StyledView>
                        )}
                        <StyledView className="absolute bottom-0 right-0 bg-surface-highlight rounded-full p-2 border-2 border-background">
                            <Ionicons name="camera" size={16} color="#f59e0b" />
                        </StyledView>
                    </StyledTouchableOpacity>
                    <StyledText className="text-text-secondary mt-2 text-sm">Tap to change photo</StyledText>
                </StyledView>

                {/* Name Input */}
                <Card className="mb-4 bg-surface border-surface-highlight">
                    <Input
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Your display name"
                        className="bg-surface-highlight text-text-primary border-surface-highlight"
                    />
                </Card>

                {/* Bio Input */}
                <Card className="mb-4 bg-surface border-surface-highlight">
                    <StyledText className="text-text-secondary mb-2 text-sm font-medium">Bio</StyledText>
                    <StyledTextInput
                        value={bio}
                        onChangeText={(text) => setBio(text.slice(0, 160))}
                        placeholder="Tell us about yourself..."
                        placeholderTextColor="#52525b"
                        multiline
                        numberOfLines={3}
                        className="bg-surface-highlight p-3 rounded-lg text-text-primary min-h-[80px]"
                        style={{ textAlignVertical: 'top' }}
                    />
                    <StyledText className="text-text-muted text-xs mt-1 text-right">
                        {bio.length}/160
                    </StyledText>
                </Card>

                {/* Creative Focus Picker */}
                <Card className="mb-4 bg-surface border-surface-highlight">
                    <StyledText className="text-text-secondary mb-3 text-sm font-medium">Creative Focus</StyledText>
                    <StyledText className="text-text-muted text-xs mb-3">What type of trailers do you love?</StyledText>
                    <StyledView className="flex-row flex-wrap gap-2">
                        {CREATIVE_FOCUS_OPTIONS.map((option) => (
                            <StyledTouchableOpacity
                                key={option.value}
                                onPress={() => setCreativeFocus(option.value)}
                                className={`px-3 py-2 rounded-full border ${creativeFocus === option.value
                                        ? 'bg-primary border-primary'
                                        : 'bg-surface-highlight border-surface-highlight'
                                    }`}
                            >
                                <StyledText className={`text-sm ${creativeFocus === option.value ? 'text-surface font-semibold' : 'text-text-primary'
                                    }`}>
                                    {option.icon} {option.label}
                                </StyledText>
                            </StyledTouchableOpacity>
                        ))}
                    </StyledView>
                </Card>
            </StyledScrollView>
        </StyledView>
    );
}
