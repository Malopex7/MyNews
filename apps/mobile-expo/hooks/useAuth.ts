import { useCallback, useState } from 'react';
import { useAuthStore } from '../state/authStore';
import { authApi } from '../services/api';
import type { LoginDTO, RegisterDTO } from '@packages/schemas';

export const useAuth = () => {
    const { user, isAuthenticated, isLoading, setAuth, logout } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const login = useCallback(async (data: LoginDTO) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await authApi.login(data);
            await setAuth(response.user, response.accessToken, response.refreshToken);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [setAuth]);

    const register = useCallback(async (data: RegisterDTO) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await authApi.register(data);
            await setAuth(response.user, response.accessToken, response.refreshToken);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [setAuth]);

    const handleLogout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            // Ignore logout errors
        } finally {
            await logout();
        }
    }, [logout]);

    return {
        user,
        isAuthenticated,
        isLoading,
        isSubmitting,
        error,
        login,
        register,
        logout: handleLogout,
        clearError: () => setError(null),
    };
};
