import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { userApi, mediaApi } from '../../services/api';

interface CreatorProfile {
    id: string;
    username: string;
    name: string;
    profile: {
        displayName: string;
        bio: string;
        avatarUrl?: string;
        creativeFocus: string[];
    };
    metrics: {
        followersCount: number;
        followingCount: number;
        totalLikesReceived: number;
    };
}

export default function CreatorProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const router = useRouter();
    const [profile, setProfile] = useState<CreatorProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [username]);

    const loadProfile = async () => {
        if (!username) return;

        setIsLoading(true);
        try {
            // Use the public profile endpoint
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/${username}/profile`
            );
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Failed to load creator profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={[styles.container, styles.center]}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.errorText}>Creator not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>@{username}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {profile.profile.displayName?.charAt(0).toUpperCase() || '?'}
                        </Text>
                    </View>

                    <Text style={styles.displayName}>{profile.profile.displayName}</Text>

                    {profile.profile.bio ? (
                        <Text style={styles.bio}>{profile.profile.bio}</Text>
                    ) : null}

                    {/* Metrics */}
                    <View style={styles.metricsRow}>
                        <View style={styles.metric}>
                            <Text style={styles.metricValue}>{profile.metrics.followersCount}</Text>
                            <Text style={styles.metricLabel}>Followers</Text>
                        </View>
                        <View style={styles.metric}>
                            <Text style={styles.metricValue}>{profile.metrics.followingCount}</Text>
                            <Text style={styles.metricLabel}>Following</Text>
                        </View>
                        <View style={styles.metric}>
                            <Text style={styles.metricValue}>{profile.metrics.totalLikesReceived}</Text>
                            <Text style={styles.metricLabel}>Likes</Text>
                        </View>
                    </View>

                    {/* Creative Focus Tags */}
                    {profile.profile.creativeFocus.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {profile.profile.creativeFocus.map((focus) => (
                                <View key={focus} style={styles.tag}>
                                    <Text style={styles.tagText}>{focus}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Trailers Section Placeholder */}
                <View style={styles.trailersSection}>
                    <Text style={styles.sectionTitle}>Trailers</Text>
                    <Text style={styles.placeholderText}>Coming soon...</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    backIcon: {
        padding: 4,
    },
    headerTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '700',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    avatarText: {
        fontSize: 32,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    displayName: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    bio: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
        marginVertical: 16,
    },
    metric: {
        alignItems: 'center',
    },
    metricValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    metricLabel: {
        color: '#888',
        fontSize: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    tag: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    tagText: {
        color: '#FFD700',
        fontSize: 12,
        textTransform: 'capitalize',
    },
    trailersSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    sectionTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    placeholderText: {
        color: '#666',
        fontSize: 14,
    },
    errorText: {
        color: '#888',
        fontSize: 16,
        marginBottom: 16,
    },
    backButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'black',
        fontWeight: '600',
    },
});
