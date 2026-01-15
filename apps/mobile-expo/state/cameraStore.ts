import { create } from 'zustand';

export interface IClip {
    uri: string;
    duration: number;
    timestamp: number;
}

interface ICameraStore {
    isRecording: boolean;
    recordedClips: IClip[];
    currentClip: IClip | null;
    recordingDuration: number;

    setIsRecording: (isRecording: boolean) => void;
    setRecordingDuration: (duration: number) => void;
    saveClip: (uri: string, duration: number) => void;
    setCurrentClip: (clip: IClip | null) => void;
    discardCurrentClip: () => void;
    addClipToList: () => void;
    clearClips: () => void;
}

export const useCameraStore = create<ICameraStore>((set, get) => ({
    isRecording: false,
    recordedClips: [],
    currentClip: null,
    recordingDuration: 0,

    setIsRecording: (isRecording) => set({ isRecording }),

    setRecordingDuration: (duration) => set({ recordingDuration: duration }),

    saveClip: (uri, duration) => {
        const clip: IClip = {
            uri,
            duration,
            timestamp: Date.now(),
        };
        set({ currentClip: clip, isRecording: false, recordingDuration: 0 });
    },

    setCurrentClip: (clip) => set({ currentClip: clip }),

    discardCurrentClip: () => set({ currentClip: null }),

    addClipToList: () => {
        const { currentClip, recordedClips } = get();
        if (currentClip) {
            set({
                recordedClips: [...recordedClips, currentClip],
                currentClip: null,
            });
        }
    },

    clearClips: () => set({ recordedClips: [], currentClip: null }),
}));
