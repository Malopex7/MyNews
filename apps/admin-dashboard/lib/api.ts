import axios from 'axios';
import { PaginatedResponse, Report, User } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh endpoint
                const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });

                if (data.accessToken) {
                    // Update tokens in storage
                    localStorage.setItem('accessToken', data.accessToken);
                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                    }

                    // Update cookie for middleware (7 days)
                    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`;

                    // Update authorization header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clean up and redirect
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // Clear cookie
                document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

                // Let the specific page handle the 401 display or middleware handle redirect
                // window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        return data;
    },

    refreshToken: async (refreshToken: string) => {
        const { data } = await api.post('/api/auth/refresh', { refreshToken });
        return data;
    },
};

// Reports API
export const reportsAPI = {
    getAll: async (params?: { status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Report>> => {
        const { data } = await api.get('/api/reports', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/api/reports/${id}`);
        return data;
    },

    update: async (id: string, payload: { status?: string; reviewNotes?: string }) => {
        const { data } = await api.patch(`/api/reports/${id}`, payload);
        return data;
    },
};

// Media API
export const mediaAPI = {
    delete: async (id: string) => {
        const { data } = await api.delete(`/api/media/${id}`);
        return data;
    }
};

// Users API
export const usersAPI = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
        profileType?: string;
    }) => {
        const { data } = await api.get('/api/users', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/api/users/${id}`);
        return data;
    },

    suspend: async (id: string) => {
        const { data } = await api.post(`/api/users/${id}/suspend`);
        return data;
    },

    unsuspend: async (id: string) => {
        const { data } = await api.post(`/api/users/${id}/unsuspend`);
        return data;
    },

    getActivity: async (id: string, limit?: number) => {
        const { data } = await api.get(`/api/users/${id}/activity`, { params: { limit } });
        return data;
    },

    getReports: async (id: string, limit?: number) => {
        const { data } = await api.get(`/api/users/${id}/reports`, { params: { limit } });
        return data;
    },
};

// Admin Stats API (placeholder - will need backend implementation)
export const adminAPI = {
    getStats: async () => {
        const { data } = await api.get('/api/admin/stats');
        return data;
    },

    getUserAnalytics: async (period = '30d') => {
        const { data } = await api.get('/api/admin/analytics/users', { params: { period } });
        return data;
    },

    getContentAnalytics: async (period = '30d') => {
        const { data } = await api.get('/api/admin/analytics/content', { params: { period } });
        return data;
    },

    getReportAnalytics: async (period = '30d') => {
        const { data } = await api.get('/api/admin/analytics/reports', { params: { period } });
        return data;
    },
};

export default api;
