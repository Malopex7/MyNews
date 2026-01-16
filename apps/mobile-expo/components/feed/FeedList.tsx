import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ViewToken } from 'react-native';
import FeedItem from './FeedItem';

const { height } = Dimensions.get('window');

// Mock Data for Phase 3
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
    const [activeVideoId, setActiveVideoId] = useState<string>(FEED_DATA[0].id);

    // Viewable configuration to detect which item is currently focused
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80, // Item is considered visible if 80% is shown
    }).current;

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const visibleItem = viewableItems[0];
            if (visibleItem.item) {
                setActiveVideoId(visibleItem.item.id);
            }
        }
    }, []);

    const renderItem = ({ item }: { item: typeof FEED_DATA[0] }) => (
        <FeedItem item={item} isActive={item.id === activeVideoId} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={FEED_DATA}
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
    list: {
        flex: 1,
    },
});
