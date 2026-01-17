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
    (error) => {
        if (error.response?.status === 401) {
            // Clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
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

// Users API
export const usersAPI = {
    getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
        const { data } = await api.get('/api/users', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/api/users/${id}`);
        return data;
    },

    suspend: async (id: string, reason: string) => {
        const { data } = await api.patch(`/api/users/${id}/suspend`, { reason });
        return data;
    },

    unsuspend: async (id: string) => {
        const { data } = await api.patch(`/api/users/${id}/unsuspend`);
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
