import { AxiosInstance } from 'axios';
import type { User, UpdateUserDTO, PaginatedResponse } from '@packages/schemas';

export interface WatchlistItem {
    id: string;
    title: string;
    genre: string;
    creativeType: 'Original' | 'Parody' | 'Remix';
    url: string;
}

export interface WatchlistResponse {
    items: WatchlistItem[];
    total: number;
}

export const createUserApi = (client: AxiosInstance) => ({
    getMe: async (): Promise<User> => {
        const response = await client.get<User>('/users/me');
        return response.data;
    },

    getById: async (id: string): Promise<User> => {
        const response = await client.get<User>(`/users/${id}`);
        return response.data;
    },

    getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<User>> => {
        const response = await client.get<PaginatedResponse<User>>('/users', {
            params: { page, limit },
        });
        return response.data;
    },

    update: async (id: string, data: UpdateUserDTO): Promise<User> => {
        const response = await client.patch<User>(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await client.delete(`/users/${id}`);
    },

    // Watchlist methods
    getWatchlist: async (): Promise<WatchlistResponse> => {
        const response = await client.get<WatchlistResponse>('/users/me/watchlist');
        return response.data;
    },

    addToWatchlist: async (mediaId: string): Promise<void> => {
        await client.post(`/users/me/watchlist/${mediaId}`);
    },

    removeFromWatchlist: async (mediaId: string): Promise<void> => {
        await client.delete(`/users/me/watchlist/${mediaId}`);
    },

    checkWatchlist: async (mediaId: string): Promise<boolean> => {
        const response = await client.get<{ inWatchlist: boolean }>(`/users/me/watchlist/${mediaId}`);
        return response.data.inWatchlist;
    },
});

export type UserApi = ReturnType<typeof createUserApi>;
