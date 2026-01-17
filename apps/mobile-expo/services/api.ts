import { createApiClient, createAuthApi, createUserApi, createMediaApi, createCommentsApi } from '@packages/api-client';
import { useAuthStore } from '../state/authStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create API client with token management
export const apiClient = createApiClient({
    baseURL: API_BASE_URL,

    getAccessToken: () => useAuthStore.getState().accessToken,

    getRefreshToken: () => useAuthStore.getState().refreshToken,

    onTokenRefresh: async (accessToken, refreshToken) => {
        await useAuthStore.getState().setTokens(accessToken, refreshToken);
    },

    onAuthError: async () => {
        await useAuthStore.getState().logout();
    },
});

// Create typed API instances
export const authApi = createAuthApi(apiClient);
export const userApi = createUserApi(apiClient);
export const mediaApi = createMediaApi(apiClient);
export const commentsApi = createCommentsApi(apiClient);
