import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
    baseURL: string;
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    onTokenRefresh: (accessToken: string, refreshToken: string) => void;
    onAuthError: () => void;
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
    const client = axios.create({
        baseURL: config.baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 30000,
    });

    // Request interceptor - add auth token
    client.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig) => {
            const token = config.getAccessToken();
            if (token && requestConfig.headers) {
                requestConfig.headers.Authorization = `Bearer ${token}`;
            }
            return requestConfig;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            return client(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = config.getRefreshToken();
                if (!refreshToken) {
                    config.onAuthError();
                    return Promise.reject(error);
                }

                try {
                    const response = await axios.post(`${config.baseURL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    config.onTokenRefresh(accessToken, newRefreshToken);
                    processQueue(null, accessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return client(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError as Error, null);
                    config.onAuthError();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );

    return client;
};
