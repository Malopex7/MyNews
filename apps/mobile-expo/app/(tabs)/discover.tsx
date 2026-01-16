import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { mediaApi } from '../../services/api';
import { Category, FeedItem } from '@packages/api-client';
import CategoryRow from '../../components/feed/CategoryRow';

interface CategoryWithItems extends Category {
    items: FeedItem[];
}

export default function DiscoverScreen() {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryWithItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch category definitions
            const categoriesRes = await mediaApi.getCategories();

            // 2. Fetch items for each category in parallel
            const categoriesWithItems = await Promise.all(
                categoriesRes.categories.map(async (cat) => {
                    try {
                        const feedRes = await mediaApi.getFeed({
                            creativeType: cat.filter.creativeType as any,
                            genre: cat.filter.genre,
                            sort: cat.filter.sort,
                            limit: 10,
                        });
                        return { ...cat, items: feedRes.items };
                    } catch {
                        return { ...cat, items: [] };
                    }
                })
            );

            setCategories(categoriesWithItems);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleItemPress = (item: FeedItem) => {
        // TODO: Navigate to player or filtered feed view
        console.log('Pressed item:', item.id);
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>Discover</Text>

                {categories.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No categories available</Text>
                    </View>
                ) : (
                    categories.map((cat) => (
                        <CategoryRow
                            key={cat.id}
                            title={cat.name}
                            items={cat.items}
                            onItemPress={handleItemPress}
                        />
                    ))
                )}
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFD700',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        fontFamily: 'Outfit-Bold',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
});
