import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
}

export default function FeedItem({ item, isActive }: FeedItemProps) {
    const video = useRef<Video>(null);

    useEffect(() => {
        if (isActive) {
            video.current?.playAsync();
        } else {
            video.current?.pauseAsync();
        }
    }, [isActive]);

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={[StyleSheet.absoluteFill]}
                source={{ uri: item.videoUri }}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={isActive}
                isMuted={true}
            />

            {/* Gradient Overlay for Text Readability */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
            />

            <SafeAreaView style={styles.overlay} edges={['bottom', 'left', 'right']}>
                <View style={styles.contentContainer}>
                    {/* Metadata */}
                    <View style={styles.textContainer}>
                        <View style={styles.badgeContainer}>
                            <View style={[styles.badge, item.type === 'Original' ? styles.badgeOriginal : styles.badgeParody]}>
                                <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.genreText}>• {item.genre}</Text>
                        </View>

                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.creator}>@{item.creator}</Text>
                    </View>

                    {/* Actions Sidebar */}
                    <View style={styles.actionsContainer}>
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
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height, // Full screen height including tab bar area (handled by overlay)
        backgroundColor: 'black',
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
        paddingBottom: 80, // Space for Bottom Tab Bar
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
        backgroundColor: '#FFD700', // Gold
    },
    badgeParody: {
        backgroundColor: '#FF4500', // OrangeRed
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
