import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface FeedItemProps {
    item: {
        id: string;
        videoUri: string;
        title: string;
        creator: string;
        genre: string;
        type: 'Original' | 'Parody';
        likes: number;
        comments: number;
    };
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    isSaved: boolean;
    onToggleSave: (id: string) => void;
}

export default function FeedItem({ item, isActive, isMuted, onToggleMute, isSaved, onToggleSave }: FeedItemProps) {
    const video = useRef<Video>(null);
    const router = useRouter();

    useEffect(() => {
        if (isActive) {
            video.current?.playAsync();
        } else {
            video.current?.pauseAsync();
        }
    }, [isActive]);

    return (
        <View style={styles.container}>
            <Pressable style={StyleSheet.absoluteFill} onPress={onToggleMute}>
                <Video
                    ref={video}
                    style={[StyleSheet.absoluteFill]}
                    source={{ uri: item.videoUri }}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay={isActive}
                    isMuted={isMuted}
                />
            </Pressable>

            {/* Mute Indicator */}
            {isMuted && isActive && (
                <View style={styles.muteIndicator}>
                    <Ionicons name="volume-mute" size={20} color="white" />
                </View>
            )}

            {/* Gradient Overlay for Text Readability */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
                pointerEvents="none"
            />

            <SafeAreaView style={styles.overlay} edges={['bottom', 'left', 'right']} pointerEvents="box-none">
                <View style={styles.contentContainer} pointerEvents="box-none">
                    {/* Metadata */}
                    <View style={styles.textContainer} pointerEvents="box-none">
                        <View style={styles.badgeContainer}>
                            <View style={[styles.badge, item.type === 'Original' ? styles.badgeOriginal : styles.badgeParody]}>
                                <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.genreText}>• {item.genre}</Text>
                        </View>

                        <Text style={styles.title}>{item.title}</Text>
                        <TouchableOpacity
                            onPress={() => router.push(`/creator/${item.creator}`)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.creatorLink}>@{item.creator}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Actions Sidebar */}
                    <View style={styles.actionsContainer}>
                        {/* Mute Toggle Button */}
                        <TouchableOpacity style={styles.actionButton} onPress={onToggleMute}>
                            <Ionicons
                                name={isMuted ? "volume-mute" : "volume-high"}
                                size={28}
                                color="white"
                            />
                            <Text style={styles.actionText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="heart-outline" size={32} color="white" />
                            <Text style={styles.actionText}>{item.likes}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-outline" size={30} color="white" />
                            <Text style={styles.actionText}>{item.comments}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-social-outline" size={30} color="white" />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>

                        {/* Response Button */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push(`/respond?originalId=${item.id}`)}
                        >
                            <Ionicons name="git-branch-outline" size={30} color="white" />
                            <Text style={styles.actionText}>Respond</Text>
                        </TouchableOpacity>

                        {/* Watchlist Button */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onToggleSave(item.id)}
                        >
                            <Ionicons
                                name={isSaved ? "bookmark" : "bookmark-outline"}
                                size={30}
                                color={isSaved ? "#FFD700" : "white"}
                            />
                            <Text style={styles.actionText}>{isSaved ? 'Saved' : 'Save'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: 'black',
    },
    muteIndicator: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 300,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 80,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    badgeOriginal: {
        backgroundColor: '#FFD700',
    },
    badgeParody: {
        backgroundColor: '#FF4500',
    },
    badgeText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 10,
    },
    genreText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    creator: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    creatorLink: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    actionsContainer: {
        alignItems: 'center',
        paddingBottom: 8,
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
});
