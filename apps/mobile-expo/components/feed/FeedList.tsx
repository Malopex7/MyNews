import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ViewToken, ActivityIndicator, Text } from 'react-native';
import FeedItem from './FeedItem';
import { mediaApi } from '../../services/api';
import { FeedItem as ApiFeedItem } from '@packages/api-client';

const { height } = Dimensions.get('window');

// Mock Data for Phase 3 (Fallback)
const FEED_DATA = [
    {
        id: '1',
        videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        title: 'Big Buck Bunny Trailer',
        creator: 'blender_official',
        genre: 'Animation',
        type: 'Original' as const,
        likes: 1205,
        comments: 45,
    },
    {
        id: '2',
        videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        title: 'Dream of the Machine',
        creator: 'orange_project',
        genre: 'Sci-Fi',
        type: 'Original' as const,
        likes: 892,
        comments: 120,
    },
    {
        id: '3',
        videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Parody: Fast Furious 99',
        creator: 'movie_buff',
        genre: 'Action Comedy',
        type: 'Parody' as const,
        likes: 3400,
        comments: 560,
    },
];

export default function FeedList() {
    const [feedData, setFeedData] = useState<any[]>([]);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Viewable configuration to detect which item is currently focused
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80, // Item is considered visible if 80% is shown
    }).current;

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching feed...');
            const response = await mediaApi.getFeed({ sort: 'quality' });
            console.log('Feed response:', response.items.length, 'items');

            if (response.items.length > 0) {
                const mappedItems = response.items.map((item: ApiFeedItem) => ({
                    id: item.id,
                    videoUri: `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}${item.url}`,
                    title: item.title || 'Untitled',
                    creator: item.creator || 'Unknown',
                    genre: item.genre || 'General',
                    type: (item.creativeType as any) || 'Original',
                    likes: item.metrics?.likes || 0,
                    comments: item.metrics?.comments || 0,
                }));
                setFeedData(mappedItems);
                setActiveVideoId(mappedItems[0].id);
            } else {
                setFeedData([]);
            }
        } catch (error) {
            console.log('Failed to fetch feed, using mock data', error);
            setFeedData(FEED_DATA);
            setActiveVideoId(FEED_DATA[0].id);
        } finally {
            setIsLoading(false);
        }
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const visibleItem = viewableItems[0];
            if (visibleItem.item) {
                setActiveVideoId(visibleItem.item.id);
            }
        }
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <FeedItem item={item} isActive={item.id === activeVideoId} />
    );

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (feedData.length === 0) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.text}>No videos found. Check back later!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={feedData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                snapToAlignment="start"
                decelerationRate="fast"
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit-Medium', // Handle font later if missing
    },
});
