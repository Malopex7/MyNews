import { AxiosInstance } from 'axios';
import type { LoginDTO, RegisterDTO, AuthResponse, RefreshTokenDTO } from '@packages/schemas';

export const createAuthApi = (client: AxiosInstance) => ({
    login: async (data: LoginDTO): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterDTO): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    refresh: async (data: RefreshTokenDTO): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/auth/refresh', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await client.post('/auth/logout');
    },
});

export type AuthApi = ReturnType<typeof createAuthApi>;
