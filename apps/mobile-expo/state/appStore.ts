import { create } from 'zustand';

interface AppState {
    isOnline: boolean;
    theme: 'light' | 'dark' | 'system';

    // Actions
    setOnlineStatus: (isOnline: boolean) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isOnline: true,
    theme: 'system',

    setOnlineStatus: (isOnline) => set({ isOnline }),
    setTheme: (theme) => set({ theme }),
}));
