import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { useCameraStore } from '../state';

// Mock types
type CameraType = 'front' | 'back';
type FlashMode = 'on' | 'off' | 'auto' | 'torch';

const MAX_DURATION_SECONDS = 180;
const MIN_DURATION_SECONDS = 30;

interface IUseCameraReturn {
    // Permissions
    hasPermission: boolean | null;
    requestPermissions: () => Promise<boolean>;

    // Camera ref
    cameraRef: React.MutableRefObject<any>;

    // Camera settings
    facing: CameraType;
    flash: FlashMode;
    toggleFacing: () => void;
    toggleFlash: () => void;

    // Recording
    isRecording: boolean;
    recordingDuration: number;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;

    // Constraints
    maxDuration: number;
    minDuration: number;
    canSaveClip: boolean;
}

export function useCamera(): IUseCameraReturn {
    const cameraRef = useRef<any>(null);

    // Always null permission to show unavailable state or mock success if needed
    // But since we are disabling it, we can just return false/null
    const [hasPermission, setHasPermission] = useState<boolean | null>(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('off');

    const {
        isRecording,
        recordingDuration,
        setIsRecording,
        setRecordingDuration,
    } = useCameraStore();

    const requestPermissions = useCallback(async () => {
        // Mock permission request
        return false;
    }, []);

    const toggleFacing = useCallback(() => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    }, []);

    const toggleFlash = useCallback(() => {
        setFlash((current) => {
            if (current === 'off') return 'on';
            if (current === 'on') return 'auto';
            return 'off';
        });
    }, []);

    const startRecording = useCallback(async () => {
        console.warn('Camera disabled');
    }, []);

    const stopRecording = useCallback(async () => {
        console.warn('Camera disabled');
    }, []);

    const canSaveClip = false;

    return {
        hasPermission,
        requestPermissions,
        cameraRef,
        facing,
        flash,
        toggleFacing,
        toggleFlash,
        isRecording,
        recordingDuration,
        startRecording,
        stopRecording,
        maxDuration: MAX_DURATION_SECONDS,
        minDuration: MIN_DURATION_SECONDS,
        canSaveClip,
    };
}
