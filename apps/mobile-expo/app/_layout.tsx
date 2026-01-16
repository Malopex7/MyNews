import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useCallback } from 'react';
import { useAuthStore } from '../state';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Import global CSS for web Tailwind support
import '../global.css';

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
        const inOnboardingGroup = segments[0] === '(onboarding)';

        if (!isAuthenticated) {
            // If not authenticated and not in auth group, go to login
            if (!inAuthGroup) {
                router.replace('/(auth)/login');
            }
        } else {
            // Authenticated
            const hasProfileType = !!useAuthStore.getState().user?.profileType;

            if (!hasProfileType) {
                // If no profile type, enforce onboarding
                if (!inOnboardingGroup) {
                    router.replace('/(onboarding)/role-selection');
                }
            } else {
                // Have profile type, should be in main app
                // If in auth or onboarding, go to feed
                if (inAuthGroup || inOnboardingGroup) {
                    router.replace('/(tabs)/feed');
                }
            }
        }
    }, [isAuthenticated, segments, isAuthLoading, fontsLoaded]);

    if (isAuthLoading || !fontsLoaded) {
        return null; // Splash screen handles the loading view
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Stack screenOptions={{ headerShown: false }} />
        </View>
    );
}

