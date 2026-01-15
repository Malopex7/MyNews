// API Constants
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
    },
    USERS: {
        BASE: '/users',
        ME: '/users/me',
        BY_ID: (id: string) => `/users/${id}`,
    },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme',
} as const;

// Timeouts
export const TIMEOUTS = {
    API_REQUEST: 30000, // 30 seconds
    TOKEN_REFRESH_BUFFER: 60000, // 1 minute before expiry
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;
