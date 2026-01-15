import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useCallback } from 'react';
import { useAuthStore } from '../state';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const StyledView = styled(View);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { isAuthenticated, isLoading: isAuthLoading, loadStoredAuth } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    });

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded && !isAuthLoading) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, isAuthLoading]);

    useEffect(() => {
        if (isAuthLoading || !fontsLoaded) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (isAuthenticated && inAuthGroup) {
            router.replace('/(tabs)/feed');
        } else if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, segments, isAuthLoading, fontsLoaded]);

    if (isAuthLoading || !fontsLoaded) {
        return null; // Splash screen handles the loading view
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Slot />
        </View>
    );
}
