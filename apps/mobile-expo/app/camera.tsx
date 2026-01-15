import React from 'react';
import { Stack } from 'expo-router';
import { CameraScreen } from '../components/camera';

export default function CameraRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    gestureEnabled: false,
                }}
            />
            <CameraScreen />
        </>
    );
}
