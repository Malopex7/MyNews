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
        PUBLIC_PROFILE: (username: string) => `/users/${username}/profile`,
        FOLLOW: (id: string) => `/users/${id}/follow`,
    },
} as const;

// Profile Types (viewer vs creator)
export const PROFILE_TYPES = {
    VIEWER: 'viewer',
    CREATOR: 'creator',
} as const;

export type ProfileType = (typeof PROFILE_TYPES)[keyof typeof PROFILE_TYPES];

// Genres / Creative Focus Options
export const GENRES = [
    'action',
    'comedy',
    'drama',
    'sci-fi',
    'horror',
    'documentary',
    'thriller',
    'romance',
] as const;

export type Genre = (typeof GENRES)[number];

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


