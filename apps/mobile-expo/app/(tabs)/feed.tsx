import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FeedList from '../../components/feed/FeedList';
import { useAuth } from '../../hooks';

export default function FeedScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent />
            <FeedList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});
