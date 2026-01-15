import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '@packages/domain';

// Declare global window type for web platform
declare const window: {
    localStorage: {
        getItem: (key: string) => string | null;
        setItem: (key: string, value: string) => void;
        removeItem: (key: string) => void;
    };
} | undefined;

// Web fallback for SecureStore (localStorage)
const storage = {
    getItemAsync: async (key: string): Promise<string | null> => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            return window.localStorage.getItem(key);
        }
        return SecureStore.getItemAsync(key);
    },
    setItemAsync: async (key: string, value: string): Promise<void> => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
            return;
        }
        return SecureStore.setItemAsync(key, value);
    },
    deleteItemAsync: async (key: string): Promise<void> => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
            return;
        }
        return SecureStore.deleteItemAsync(key);
    },
};

interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    profileType?: 'viewer' | 'creator';
    bio?: string;
    avatarUrl?: string;
    creativeFocus?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
    setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
    setProfileType: (type: 'viewer' | 'creator') => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,

    setAuth: async (user, accessToken, refreshToken) => {
        await storage.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await storage.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        await storage.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));

        set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    setTokens: async (accessToken, refreshToken) => {
        await storage.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await storage.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        set({ accessToken, refreshToken });
    },

    setProfileType: async (type) => {
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, profileType: type };
            await storage.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            set({ user: updatedUser });
        }
    },

    logout: async () => {
        await storage.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        await storage.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
        await storage.deleteItemAsync(STORAGE_KEYS.USER);

        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    loadStoredAuth: async () => {
        try {
            const [accessToken, refreshToken, userJson] = await Promise.all([
                storage.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
                storage.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
                storage.getItemAsync(STORAGE_KEYS.USER),
            ]);

            if (accessToken && refreshToken && userJson) {
                const user = JSON.parse(userJson);
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
            set({ isLoading: false });
        }
    },
}));
