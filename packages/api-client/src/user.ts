import { AxiosInstance } from 'axios';
import type { User, UpdateUserDTO, PaginatedResponse } from '@packages/schemas';

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
});

export type UserApi = ReturnType<typeof createUserApi>;
