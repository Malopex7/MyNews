import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
}

interface UseApiResult<T, P extends any[]> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    execute: (...args: P) => Promise<T | null>;
    reset: () => void;
}

export const useApi = <T, P extends any[] = []>(
    apiFunction: (...args: P) => Promise<T>,
    options: UseApiOptions<T> = {}
): UseApiResult<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(
        async (...args: P): Promise<T | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await apiFunction(...args);
                setData(result);
                options.onSuccess?.(result);
                return result;
            } catch (err) {
                const axiosError = err as AxiosError<{ message?: string }>;
                const errorMessage = axiosError.response?.data?.message || 'An error occurred';
                setError(errorMessage);
                options.onError?.(errorMessage);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [apiFunction, options]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return { data, isLoading, error, execute, reset };
};
