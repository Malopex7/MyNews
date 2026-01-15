import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export default function PublishScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        videoUri: string;
        startTime: string;
        endTime: string;
        titleText?: string;
        titleStyle?: string;
        audioTrack?: string;
        voiceUri?: string;
    }>();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [isParody, setIsParody] = useState(false);
    const [agreedToLegal, setAgreedToLegal] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const genres = ["Action", "Sci-Fi", "Horror", "Comedy", "Drama", "Thriller"];

    const handlePublish = async () => {
        if (!title.trim()) {
            Alert.alert("Missing Title", "Please give your trailer a title.");
            return;
        }
        if (!genre) {
            Alert.alert("Missing Genre", "Please select a genre.");
            return;
        }
        if (!agreedToLegal) {
            Alert.alert("Legal Required", "You must acknowledge the legal disclaimer to publish.");
            return;
        }

        setIsPublishing(true);

        // Simulate API Call
        setTimeout(() => {
            setIsPublishing(false);
            console.log("Published Trailer:", {
                ...params,
                metadata: { title, description, genre, type: isParody ? 'Parody' : 'Original' }
            });

            Alert.alert("Published!", "Your trailer is now live.", [
                { text: "Awesome", onPress: () => router.push('/(tabs)/inbox') } // Redirect to Inbox or Feed
            ]);
        }, 2000);
    };

    return (
        <StyledView className="flex-1 bg-background">
            {/* Header */}
            <StyledView className="flex-row items-center p-4 pt-12 border-b border-gray-800">
                <StyledTouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </StyledTouchableOpacity>
                <StyledText className="text-white font-cinematic text-lg">Publish Trailer</StyledText>
            </StyledView>

            <StyledScrollView className="flex-1 p-6">

                {/* Section: Metadata */}
                <StyledText className="text-primary font-bold mb-2 uppercase text-xs tracking-wider">Trailer Details</StyledText>

                <StyledTextInput
                    className="bg-surface p-4 rounded-lg text-white font-body text-lg mb-4 border border-gray-700"
                    placeholder="Trailer Title..."
                    placeholderTextColor="#52525b"
                    value={title}
                    onChangeText={setTitle}
                />

                <StyledTextInput
                    className="bg-surface p-4 rounded-lg text-white font-body mb-6 border border-gray-700 h-24"
                    placeholder="Description / Logline..."
                    placeholderTextColor="#52525b"
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Section: Genre */}
                <StyledText className="text-primary font-bold mb-2 uppercase text-xs tracking-wider">Genre</StyledText>
                <StyledView className="flex-row flex-wrap mb-6">
                    {genres.map(g => (
                        <StyledTouchableOpacity
                            key={g}
                            onPress={() => setGenre(g)}
                            className={`mr-2 mb-2 px-4 py-2 rounded-full border ${genre === g ? 'bg-primary border-primary' : 'bg-surface border-gray-600'}`}
                        >
                            <StyledText className={genre === g ? 'text-black font-bold' : 'text-text-secondary'}>{g}</StyledText>
                        </StyledTouchableOpacity>
                    ))}
                </StyledView>

                {/* Section: Type */}
                <StyledText className="text-primary font-bold mb-2 uppercase text-xs tracking-wider">Content Type</StyledText>
                <StyledView className="flex-row items-center mb-8 bg-surface p-4 rounded-lg border border-gray-700">
                    <StyledText className="text-white flex-1 font-body">Is this a Parody?</StyledText>
                    <Switch
                        value={isParody}
                        onValueChange={setIsParody}
                        trackColor={{ false: "#3f3f46", true: "#EAB308" }}
                        thumbColor="#ffffff"
                    />
                </StyledView>

                {/* Section: Legal */}
                <StyledView className="flex-row items-start mb-8">
                    <TouchableOpacity
                        onPress={() => setAgreedToLegal(!agreedToLegal)}
                        className={`w-6 h-6 rounded border mr-3 mt-1 items-center justify-center ${agreedToLegal ? 'bg-primary border-primary' : 'border-gray-500'}`}
                    >
                        {agreedToLegal && <Ionicons name="checkmark" size={16} color="black" />}
                    </TouchableOpacity>
                    <StyledView className="flex-1">
                        <StyledText className="text-text-secondary text-sm">
                            I certify that this is a fan creation and I am not claiming ownership of the original intellectual property. I agree to the FanFlick Terms of Service.
                        </StyledText>
                    </StyledView>
                </StyledView>

                {/* Publish Button */}
                <StyledTouchableOpacity
                    onPress={handlePublish}
                    disabled={isPublishing}
                    className={`w-full py-4 rounded-lg items-center ${isPublishing ? 'bg-gray-700' : 'bg-primary'}`}
                >
                    <StyledText className={`font-cinematic text-lg tracking-widest ${isPublishing ? 'text-gray-400' : 'text-black'}`}>
                        {isPublishing ? 'PUBLISHING...' : 'PUBLISH TRAILER'}
                    </StyledText>
                </StyledTouchableOpacity>

                <StyledView className="h-20" />
            </StyledScrollView>
        </StyledView>
    );
}
