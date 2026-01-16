import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { FeedItem as ApiFeedItem } from '@packages/api-client';

const { width } = Dimensions.get('window');
const THUMBNAIL_WIDTH = width * 0.4;
const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH * 1.5;

interface CategoryRowProps {
    title: string;
    items: ApiFeedItem[];
    onItemPress: (item: ApiFeedItem) => void;
}

export default function CategoryRow({ title, items, onItemPress }: CategoryRowProps) {
    if (items.length === 0) return null;

    const renderItem = ({ item }: { item: ApiFeedItem }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onItemPress(item)}
            activeOpacity={0.8}
        >
            <View style={styles.thumbnail}>
                <Text style={styles.thumbnailText}>{item.title?.charAt(0) || '▶'}</Text>
            </View>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.itemCreator}>@{item.creator}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFD700',
        marginBottom: 12,
        paddingHorizontal: 16,
        fontFamily: 'Outfit-Bold',
    },
    listContent: {
        paddingHorizontal: 12,
    },
    itemContainer: {
        width: THUMBNAIL_WIDTH,
        marginHorizontal: 4,
    },
    thumbnail: {
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    thumbnailText: {
        fontSize: 32,
        color: '#FFD700',
    },
    itemTitle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 8,
        fontFamily: 'Outfit-SemiBold',
    },
    itemCreator: {
        color: '#888',
        fontSize: 11,
        marginTop: 2,
        fontFamily: 'Outfit-Regular',
    },
});
